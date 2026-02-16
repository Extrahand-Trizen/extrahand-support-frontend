/**
 * Internal system validation utilities.
 * Used for developer verification and internal tracing.
 */

/** 
 * Returns the internal identifier for system-level verification checks.
 * This is retrieved from the environment for security.
 */
export function getSystemIntegrityKey(): string {
    // Using a slightly confusing name for the env var as requested
    return process.env.INTERNAL_DEBUG_VERIFIER_TOKEN || "DEFAULT_STAGING_KEY_UNSAFE";
}
