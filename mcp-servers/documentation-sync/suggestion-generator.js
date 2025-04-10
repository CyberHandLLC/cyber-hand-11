/**
 * Suggestion Generator for MCP-DocumentationSynchronizer
 *
 * Generates code suggestions to fix documentation synchronization issues
 * by applying patterns and best practices from the documentation.
 */

/**
 * Generate code suggestions based on identified issues
 */
function generateSuggestions(filepath, content, issues, suggestions) {
  const suggestedFixes = [];

  // Process each issue and create appropriate code suggestions
  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    const suggestion = suggestions[i] || null;

    if (!suggestion) continue;

    // Handle component-specific suggestions
    if (issue.includes('missing "use client" directive')) {
      suggestedFixes.push({
        description: 'Add "use client" directive to the top of the file',
        replacement: {
          oldText: /^/,
          newText: '"use client";\n\n',
          range: [0, 0],
        },
      });
    }

    // Handle image optimization suggestions
    else if (issue.includes("HTML img tag instead of Next.js Image")) {
      // Add Next.js Image import if needed
      if (!content.includes("next/image")) {
        const importMatch = content.match(/^(import.*?;\n)(?!import\s+Image)/m);
        if (importMatch) {
          suggestedFixes.push({
            description: "Import Next.js Image component",
            replacement: {
              oldText: importMatch[1],
              newText: `${importMatch[1]}import Image from "next/image";\n`,
              range: [importMatch.index, importMatch.index + importMatch[1].length],
            },
          });
        }
      }

      // Replace img tags with Image component
      const imgTagMatches = [
        ...content.matchAll(/<img\s+src=["']([^"']+)["']\s+alt=["']([^"']+)["']([^>]*)>/g),
      ];

      for (const match of imgTagMatches) {
        suggestedFixes.push({
          description: `Replace HTML img tag with Next.js Image component for "${match[2]}"`,
          replacement: {
            oldText: match[0],
            newText: `<Image\n  src="${match[1]}"\n  alt="${match[2]}"\n  width={500}\n  height={300}\n  ${match[3]}\n/>`,
            range: [match.index, match.index + match[0].length],
          },
        });
      }
    }

    // Handle data fetching suggestions for Server Components
    else if (issue.includes("without using cache()")) {
      // Find fetch functions that aren't wrapped in cache()
      const fetchFunctionMatches = [
        ...content.matchAll(
          /(?:export\s+)?(?:async\s+)?function\s+(\w+)(?:\(\):?\s+Promise(?:<[\w<>[\],\s]+>)?)?\s*\{(?:\s|\n)*.*?fetch\(/gs
        ),
      ];

      for (const match of fetchFunctionMatches) {
        const functionName = match[1];

        if (
          !content.includes(`cache(${functionName}`) &&
          !content.includes(`${functionName} = cache(`)
        ) {
          // Add cache import if needed
          if (!content.includes("cache") && !content.includes(`from 'react'`)) {
            const reactImportMatch = content.match(
              /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]react['"]/
            );

            if (reactImportMatch) {
              const currentImports = reactImportMatch[1];
              suggestedFixes.push({
                description: "Import cache from React",
                replacement: {
                  oldText: reactImportMatch[0],
                  newText: `import { ${currentImports.trim()}, cache } from 'react'`,
                  range: [
                    reactImportMatch.index,
                    reactImportMatch.index + reactImportMatch[0].length,
                  ],
                },
              });
            } else {
              // Add new React import with cache
              const importSection = content.match(/^import.*?;\n/m);
              if (importSection) {
                suggestedFixes.push({
                  description: "Import cache from React",
                  replacement: {
                    oldText: importSection[0],
                    newText: `${importSection[0]}import { cache } from 'react';\n`,
                    range: [importSection.index, importSection.index + importSection[0].length],
                  },
                });
              }
            }
          }

          // Wrap function in cache()
          suggestedFixes.push({
            description: `Wrap ${functionName} function in cache() for deduplication`,
            replacement: {
              oldText: `function ${functionName}`,
              newText: `const ${functionName} = cache(function`,
              range: [match.index, match.index + `function ${functionName}`.length],
            },
          });

          // Add closing parenthesis at the end of the function
          const functionBody = match[0];
          const functionEndMatch = content
            .substring(match.index + functionBody.length)
            .match(/\n\}/);

          if (functionEndMatch) {
            const endPosition = match.index + functionBody.length + functionEndMatch.index + 2;
            suggestedFixes.push({
              description: `Complete the cache() wrapper for ${functionName}`,
              replacement: {
                oldText: "}",
                newText: "});",
                range: [endPosition - 1, endPosition],
              },
            });
          }
        }
      }

      // Add revalidation options if missing
      if (issue.includes("revalidation options")) {
        const fetchCalls = [...content.matchAll(/fetch\(\s*(['"`][^'"`]+['"`])/g)];

        for (const match of fetchCalls) {
          if (
            !content.substring(match.index, match.index + 200).includes("revalidate") &&
            !content.substring(match.index, match.index + 200).includes("next:")
          ) {
            suggestedFixes.push({
              description: "Add revalidation options to fetch call",
              replacement: {
                oldText: `fetch(${match[1]}`,
                newText: `fetch(${match[1]}, {\n  next: { revalidate: 3600 } // Adjust revalidation time as needed\n}`,
                range: [match.index, match.index + `fetch(${match[1]}`.length],
              },
            });
          }
        }
      }
    }

    // Handle parallel data fetching suggestions
    else if (issue.includes("Promise.all for parallel data fetching")) {
      suggestedFixes.push({
        description: "Use Promise.all for parallel data fetching",
        replacement: {
          oldText: content, // This is a complex refactoring that requires context-specific handling
          newText: content, // Placeholder - actual implementation would depend on specific code pattern
          range: [0, content.length],
        },
        message:
          "Consider refactoring multiple sequential fetch calls to use Promise.all for parallel data fetching. This improves performance by fetching data concurrently.",
      });
    }

    // Handle Suspense boundary suggestions
    else if (issue.includes("should use Suspense")) {
      suggestedFixes.push({
        description: "Add Suspense boundaries for streaming",
        replacement: {
          oldText: content, // This is a complex refactoring that requires context-specific handling
          newText: content, // Placeholder - actual implementation would depend on specific code pattern
          range: [0, content.length],
        },
        message:
          "Consider adding Suspense boundaries around data-dependent components to enable streaming. Import Suspense from React and wrap components that fetch data.",
      });
    }
  }

  return suggestedFixes;
}

module.exports = {
  generateSuggestions,
};
