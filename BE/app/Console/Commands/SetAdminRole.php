<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class SetAdminRole extends Command
{
    protected $signature = 'admin:set-role {email} {role}';
    protected $description = 'Set admin role for a user (super or content)';

    public function handle()
    {
        $email = $this->argument('email');
        $role = $this->argument('role');

        if (! in_array($role, ['super', 'content'])) {
            $this->error('Role must be "super" or "content"');
            return 1;
        }

        $user = User::where('email', $email)->first();
        if (! $user) {
            $this->error("User $email not found");
            return 1;
        }

        $user->update(['admin_role' => $role]);
        $this->info("✅ Set $email as $role admin");
        return 0;
    }
}
