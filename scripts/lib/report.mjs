// Collects problems while the blog builds. Errors stop the build; warnings ("SEO notes") do not.
export function createReport() {
  const errors = []
  const warnings = []
  return {
    errors,
    warnings,
    error: (message) => errors.push(message),
    warn: (message) => warnings.push(message),
  }
}
