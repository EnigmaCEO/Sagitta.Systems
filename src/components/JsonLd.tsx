/**
 * Emits a structured-data block.
 *
 * `<` is escaped to `<` so a value that ever contained `</script>` could
 * not close the tag early. Every value here comes from the repository's own
 * content layer rather than user input, so this is defence in depth rather than
 * a live hazard — but the escape costs nothing and the alternative is trusting
 * that no one ever pastes markup into a summary field.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
