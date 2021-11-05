echo "Build Ionic project.\n"

ionic build

echo "Copy changes to native projects.\n\n"

ionic cap copy

echo "Sync native plugins.\n"

ionic cap sync

echo "Opening apple.\n\n"

ionic cap open xcode

# for live reload
# ionic cap run android -l --external