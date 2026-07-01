#!/bin/bash
# Compile and run the eLibAP Java server
# Usage: bash server/run.sh (from project root)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DATA_DIR="$PROJECT_ROOT/data"

echo "=== eLibAP Java Server ==="
echo "Compiling..."

javac -d "$SCRIPT_DIR" "$SCRIPT_DIR/JsonFileHandler.java" "$SCRIPT_DIR/Main.java"

echo "Starting server on http://localhost:8080"
echo "Data directory: $DATA_DIR"
echo ""
echo "API endpoints:"
echo "  http://localhost:8080/api/videos"
echo "  http://localhost:8080/api/newspapers"
echo "  http://localhost:8080/api/books"
echo "  http://localhost:8080/api/events"
echo "  http://localhost:8080/api/educational"
echo ""
echo "Press Ctrl+C to stop."
echo ""

cd "$SCRIPT_DIR"
java Main "$DATA_DIR"
