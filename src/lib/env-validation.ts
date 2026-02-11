/**
 * Environment Variable Validation
 *
 * This module validates required environment variables at startup.
 * Import this in your app's entry point to ensure all required vars are set.
 */

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
}

const envVars: EnvVar[] = [
  // Database
  { name: 'DATABASE_URL', required: true, description: 'PostgreSQL connection string' },

  // External APIs
  { name: 'ANTHROPIC_API_KEY', required: false, description: 'Anthropic API key for AI features' },
  { name: 'RESEND_API_KEY', required: false, description: 'Resend API key for transactional emails' },
  { name: 'BEEHIIV_API_KEY', required: false, description: 'Beehiiv API key for newsletter subscriber sync' },
  { name: 'BEEHIIV_PUBLICATION_ID', required: false, description: 'Beehiiv publication ID' },

  // Admin & Security
  { name: 'ADMIN_PASSWORD', required: true, description: 'Admin panel password' },
  { name: 'ADMIN_APPROVE_SECRET', required: false, description: 'Secret for newsletter approval links' },
  { name: 'CRON_SECRET', required: false, description: 'Secret for cron job authentication' },

  // Site config
  { name: 'NEXT_PUBLIC_SITE_URL', required: false, description: 'Public site URL' },
];

export function validateEnv(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';

  for (const envVar of envVars) {
    const value = process.env[envVar.name];

    if (envVar.required && !value) {
      errors.push(`Missing required environment variable: ${envVar.name} (${envVar.description})`);
    }

    // Additional validation for specific vars
    if (envVar.name === 'ADMIN_PASSWORD' && value && value.length < 8) {
      errors.push(`${envVar.name} must be at least 8 characters`);
    }

    if (envVar.name === 'DATABASE_URL' && value && !value.startsWith('postgresql://') && !value.startsWith('postgres://')) {
      errors.push(`${envVar.name} must be a valid PostgreSQL connection string`);
    }
  }

  // In production, be stricter
  if (isProduction) {
    if (!process.env.ANTHROPIC_API_KEY) {
      errors.push('ANTHROPIC_API_KEY is recommended in production for AI features');
    }
    if (!process.env.RESEND_API_KEY) {
      errors.push('RESEND_API_KEY is recommended in production for email features');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate environment variables and throw if critical ones are missing
 */
export function assertEnv(): void {
  const { valid, errors } = validateEnv();

  if (!valid) {
    console.error('\n❌ Environment validation failed:\n');
    errors.forEach((err) => console.error(`  • ${err}`));
    console.error('\nPlease set the missing environment variables and restart.\n');

    // Only throw in production for required vars
    const criticalErrors = errors.filter((e) => e.includes('required'));
    if (criticalErrors.length > 0 && process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${criticalErrors.join(', ')}`);
    }
  }
}

// Auto-run validation when module is imported (optional)
// Uncomment the line below to validate on import:
// assertEnv();
