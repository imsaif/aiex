import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Custom rule to prevent hardcoded border colors
const noHardcodedBorderColorsRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prevent hardcoded border colors - use design system colors instead",
      category: "Stylistic Issues",
      recommended: true,
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        // Check for style attribute with hardcoded colors
        if (node.name.name === "style" && node.value?.expression?.type === "ObjectExpression") {
          node.value.expression.properties.forEach((prop) => {
            if (prop.key?.name?.includes("border") || prop.key?.value?.includes("border")) {
              const value = prop.value?.value || prop.value?.raw;
              if (value && typeof value === "string") {
                // Check for hex colors
                if (/#[0-9A-Fa-f]{3,6}/.test(value)) {
                  context.report({
                    node: prop,
                    message: `Hardcoded hex border color "${value}" detected. Use design system colors instead (e.g., border-gray-200, border-gray-300, border-accent-primary).`,
                  });
                }
              }
            }
          });
        }

        // Check for className attribute with bracket notation colors
        if (node.name.name === "className" && node.value?.type === "Literal") {
          const classValue = node.value.value;
          if (classValue && typeof classValue === "string") {
            // Check for border-[#...] pattern
            if (/border-\[#[0-9A-Fa-f]{3,6}\]/.test(classValue)) {
              context.report({
                node,
                message: `Hardcoded border color in className detected. Use design system colors instead (e.g., border-gray-200, border-gray-300, border-accent-primary).`,
              });
            }
            // Check for other hardcoded color patterns
            if (/\b(bg|text|border)-\[#[0-9A-Fa-f]{3,6}\]/.test(classValue)) {
              context.report({
                node,
                message: `Hardcoded hex color in className detected. Use design system colors instead.`,
              });
            }
          }
        }
      },

      Literal(node) {
        // Check string literals for style patterns
        if (typeof node.value === "string") {
          // Detect inline styles in strings like "border: 1px solid #..."
          if (/border[^:]*:\s*[^;]*#[0-9A-Fa-f]{3,6}/.test(node.value)) {
            context.report({
              node,
              message: `Hardcoded border color in inline style string detected. Use design system colors instead.`,
            });
          }
        }
      },
    };
  },
};

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "custom-rules": {
        rules: {
          "no-hardcoded-border-colors": noHardcodedBorderColorsRule,
        },
      },
    },
    rules: {
      "custom-rules/no-hardcoded-border-colors": "warn",
    },
  },
];

export default eslintConfig;
