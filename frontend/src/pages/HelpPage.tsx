import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Upload, Scissors, Download, AlertCircle } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-black mb-4">Help & Guide</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about using ModelCut
        </p>
      </div>

      <div className="space-y-6">
        <Card className="retro-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-2xl">
              <HelpCircle className="h-6 w-6" />
              Getting Started
            </CardTitle>
            <CardDescription className="text-base">
              Learn the basics of cutting 3D models
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Upload Your Model</h3>
                <p className="text-muted-foreground">
                  Start by creating a new project and uploading your 3D model. We support GLB, GLTF,
                  and OBJ formats.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <Scissors className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Adjust the Cut</h3>
                <p className="text-muted-foreground">
                  Use the cut controls to adjust the angle and position of the cutting plane. Watch
                  the preview update in real-time.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Download className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Export Parts</h3>
                <p className="text-muted-foreground">
                  Once you're happy with the cut, export each part as a separate GLB file ready for
                  use in your projects.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="retro-card">
          <CardHeader>
            <CardTitle className="font-display text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="formats">
                <AccordionTrigger className="font-bold">
                  What file formats are supported?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  ModelCut supports GLB, GLTF, and OBJ file formats. GLB and GLTF are recommended for
                  best results as they preserve materials and textures.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="size">
                <AccordionTrigger className="font-bold">
                  What's the maximum file size?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  The maximum upload size is 50MB. If your model is larger, try optimizing it in a 3D
                  editor like Blender before uploading.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="auth">
                <AccordionTrigger className="font-bold">
                  Can I sign in with Google?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Google login is not supported. ModelCut uses Internet Identity, a secure and privacy-focused authentication system built for the Internet Computer. Internet Identity protects your privacy by not tracking your activity across applications.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="controls">
                <AccordionTrigger className="font-bold">
                  How do I control the 3D viewport?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Use your mouse to interact with the 3D viewport: Left-click and drag to rotate,
                  right-click and drag to pan, and scroll to zoom in/out.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="save">
                <AccordionTrigger className="font-bold">
                  Are my projects saved automatically?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  No, you need to click the Save button to save your cut settings. The save status
                  indicator shows whether you have unsaved changes.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="export">
                <AccordionTrigger className="font-bold">
                  What format are exported files?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Exported parts are saved as GLB files, which are widely supported by 3D software and
                  game engines.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="retro-card border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-2xl">
              <AlertCircle className="h-6 w-6 text-destructive" />
              Troubleshooting
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h3 className="font-bold mb-1">Model won't load</h3>
              <p className="text-muted-foreground text-sm">
                Make sure your file is in a supported format (GLB, GLTF, or OBJ) and under 50MB. Try
                opening the file in a 3D editor to verify it's not corrupted.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Cut preview looks wrong</h3>
              <p className="text-muted-foreground text-sm">
                Try adjusting the cut angle and offset sliders. You can also toggle the reference
                model and section helper for better visualization.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-1">Export fails</h3>
              <p className="text-muted-foreground text-sm">
                Make sure you've performed a cut before trying to export. If the problem persists, try
                reloading the page and uploading your model again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
