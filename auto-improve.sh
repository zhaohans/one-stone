#!/bin/bash
set -e

MAX_ITER=3
ITER=1
CLEAN=false
ERROR_SUMMARY=""

while [ $ITER -le $MAX_ITER ]; do
  echo "\n--- Auto-Improve Iteration $ITER/$MAX_ITER ---"
  ERRORS_THIS_ITER=""

  # Format code
  if ! npx prettier --write .; then
    ERRORS_THIS_ITER+="Prettier formatting failed.\n"
  fi

  # Lint and autofix
  if ! npm run lint -- --fix; then
    ERRORS_THIS_ITER+="ESLint found issues.\n"
  fi

  # TypeScript migration (if ts-migrate is available)
  if npx --no-install ts-migrate --version > /dev/null 2>&1; then
    echo "Running ts-migrate..."
    if ! npx ts-migrate init . && npx ts-migrate rename src && npx ts-migrate migrate src; then
      ERRORS_THIS_ITER+="ts-migrate failed.\n"
    fi
  else
    echo "ts-migrate not installed, skipping TypeScript migration."
  fi

  # Type checking
  if ! npx tsc --noEmit; then
    ERRORS_THIS_ITER+="TypeScript type errors found.\n"
  fi

  # Build Storybook
  if npm run | grep -q "build-storybook"; then
    if ! npm run build-storybook; then
      ERRORS_THIS_ITER+="Storybook build failed.\n"
    fi
  else
    echo "No build-storybook script found in package.json. Skipping Storybook build."
  fi

  # Lint Storybook stories
  if [ -d "src/stories" ]; then
    if ! npx eslint src/stories --ext .ts,.tsx; then
      ERRORS_THIS_ITER+="Storybook stories linting failed.\n"
    fi
  fi

  # Chromatic visual regression
  if npm run | grep -q "chromatic"; then
    if ! npm run chromatic; then
      ERRORS_THIS_ITER+="Chromatic visual regression failed.\n"
    fi
  else
    echo "No chromatic script found in package.json. Skipping Chromatic visual regression."
  fi

  # Run tests if script exists
  if npm run | grep -q "test"; then
    if ! npm test; then
      ERRORS_THIS_ITER+="Tests failed.\n"
    fi
  else
    echo "No test script found in package.json. Skipping tests."
  fi

  # Accessibility tests (if jest-axe or similar is set up)
  if npm run | grep -q "test:a11y"; then
    if ! npm run test:a11y; then
      ERRORS_THIS_ITER+="Accessibility (a11y) tests failed.\n"
    fi
  else
    echo "No accessibility test script found. Skipping a11y tests."
  fi

  if [ -z "$ERRORS_THIS_ITER" ]; then
    CLEAN=true
    echo "\nAll checks passed on iteration $ITER!"
    break
  else
    ERROR_SUMMARY+="\nIteration $ITER errors:\n$ERRORS_THIS_ITER"
    echo "$ERRORS_THIS_ITER"
  fi

  ITER=$((ITER+1))
done

if [ "$CLEAN" = true ]; then
  echo "\nAuto-improvement complete! All checks passed."
  exit 0
else
  echo "\nAuto-improvement finished after $MAX_ITER iterations, but some errors remain:"
  echo -e "$ERROR_SUMMARY"
  exit 1
fi 