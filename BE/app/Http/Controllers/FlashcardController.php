<?php

namespace App\Http\Controllers;

use App\Models\FlashcardDeck;
use App\Models\FlashcardCard;
use Illuminate\Http\Request;

class FlashcardController extends Controller
{
    // GET /api/flashcards?is_official=true|false  — Public endpoint for both official and community decks
    public function index(Request $request)
    {
        $isOfficial = $request->boolean('is_official', false);

        if ($isOfficial) {
            return $this->adminDecks();
        } else {
            return $this->communityDecks($request);
        }
    }

    // GET /api/flashcards/admin  — Admin-created public decks
    public function adminDecks()
    {
        $decks = FlashcardDeck::with('cards')
            ->where('owner_type', 'admin')
            ->where('status', 'published')
            ->where('visibility', 'public')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($d) => $this->format($d));

        return response()->json($decks);
    }

    // GET /api/flashcards/community  — Public user decks
    public function communityDecks(Request $request)
    {
        $query = FlashcardDeck::with(['cards', 'creator'])
            ->where('owner_type', 'user')
            ->where('visibility', 'public')
            ->where('status', 'published');

        if ($request->filled('q')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->q . '%')
                  ->orWhere('subject', 'like', '%' . $request->q . '%');
            });
        }

        $decks = $query->orderByDesc('likes')->get()->map(fn ($d) => $this->format($d));

        return response()->json($decks);
    }

    // GET /api/flashcards/mine  — Authenticated user's own decks
    public function myDecks(Request $request)
    {
        $decks = FlashcardDeck::with('cards')
            ->where('created_by', $request->user()->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($d) => $this->format($d));

        return response()->json($decks);
    }

    // GET /api/flashcards/{id}
    public function show(Request $request, FlashcardDeck $deck)
    {
        $user = $request->user();

        // Private deck: only accessible by owner or admin
        if ($deck->visibility === 'private') {
            if (! $user || ($deck->created_by !== $user->id && ! $user->isAdmin())) {
                return response()->json(['message' => 'Không có quyền truy cập.'], 403);
            }
        }

        $deck->load('cards');

        return response()->json($this->format($deck));
    }

    // POST /api/flashcards  — Create new deck (authenticated)
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'subject'    => 'nullable|string|max:255',
            'icon'       => 'nullable|string',
            'color'      => 'nullable|string',
            'visibility' => 'in:public,private',
            'cards'      => 'required|array|min:1',
            'cards.*.front' => 'required|string',
            'cards.*.back'  => 'required|string',
        ]);

        $deck = FlashcardDeck::create([
            'name'       => $data['name'],
            'subject'    => $data['subject'] ?? null,
            'icon'       => $data['icon'] ?? '',
            'color'      => $data['color'] ?? '#1B3A6B',
            'visibility' => $data['visibility'] ?? 'private',
            'owner_type' => $request->user()->isAdmin() ? 'admin' : 'user',
            'created_by' => $request->user()->id,
            'status'     => 'published',
        ]);

        foreach ($data['cards'] as $i => $card) {
            FlashcardCard::create([
                'deck_id' => $deck->id,
                'front'   => $card['front'],
                'back'    => $card['back'],
                'subject' => $data['subject'] ?? null,
                'order'   => $i + 1,
            ]);
        }

        return response()->json($this->format($deck->load('cards')), 201);
    }

    // PUT /api/flashcards/{id}
    public function update(Request $request, FlashcardDeck $deck)
    {
        $user = $request->user();

        if (! $user->isAdmin() && $deck->created_by !== $user->id) {
            return response()->json(['message' => 'Không có quyền.'], 403);
        }

        $data = $request->validate([
            'name'       => 'sometimes|string|max:255',
            'subject'    => 'nullable|string',
            'visibility' => 'in:public,private',
            'status'     => 'in:published,draft',
        ]);

        $deck->update($data);

        return response()->json($this->format($deck->fresh()->load('cards')));
    }

    // DELETE /api/flashcards/{id}
    public function destroy(Request $request, FlashcardDeck $deck)
    {
        $user = $request->user();

        if (! $user->isAdmin() && $deck->created_by !== $user->id) {
            return response()->json(['message' => 'Không có quyền.'], 403);
        }

        $deck->delete();

        return response()->json(['message' => 'Xóa thành công.']);
    }

    // ── Admin CRUD ──────────────────────────────────────────────────────

    // GET /api/admin/flashcards
    public function adminIndex()
    {
        $decks = FlashcardDeck::with(['creator'])
            ->withCount('cards')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn ($d) => $this->format($d));

        return response()->json($decks);
    }

    private function format(FlashcardDeck $d): array
    {
        return [
            'id'         => $d->id,
            'name'       => $d->name,
            'subject'    => $d->subject,
            'icon'       => $d->icon,
            'color'      => $d->color,
            'visibility' => $d->visibility,
            'owner_type' => $d->owner_type,
            'status'     => $d->status,
            'likes'      => $d->likes,
            'card_count' => $d->cards_count ?? $d->cards->count(),
            'owner'      => $d->owner_type === 'admin' ? 'admin' : ($d->creator?->name ?? 'me'),
            'owner_avatar' => $d->creator ? mb_strtoupper(mb_substr($d->creator->name, -2)) : 'AD',
            'cards'      => $d->relationLoaded('cards')
                ? $d->cards->map(fn ($c) => [
                    'id'      => $c->id,
                    'front'   => $c->front,
                    'back'    => $c->back,
                    'subject' => $c->subject,
                    'order'   => $c->order,
                ])->values()
                : [],
        ];
    }
}
