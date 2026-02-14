import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scissors, Upload, Download, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div
        className="absolute inset-0 opacity-10 bg-repeat"
        style={{ backgroundImage: 'url(/assets/generated/retro-pattern.dim_1024x1024.png)' }}
      />

      <section
        className="relative py-20 px-4 bg-gradient-to-br from-primary/20 to-secondary/20"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x768.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-display font-black mb-6 text-primary retro-outline">
            ModelCut
          </h1>
          <p className="text-2xl md:text-3xl font-bold mb-8 max-w-3xl mx-auto">
            Slice your 3D models with style! Upload, cut, and export in seconds.
          </p>
          <Button
            onClick={() => navigate({ to: '/new-project' })}
            size="lg"
            className="retro-button bg-primary text-primary-foreground font-bold text-xl px-8 py-6"
          >
            <Sparkles className="mr-2 h-6 w-6" />
            Start Cutting Now
          </Button>
        </div>
      </section>

      <section className="relative py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl font-display font-black text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="retro-card">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-display text-2xl">1. Upload</CardTitle>
                <CardDescription className="text-base">
                  Upload your 3D model in GLB, GLTF, or OBJ format
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="retro-card">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Scissors className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="font-display text-2xl">2. Cut</CardTitle>
                <CardDescription className="text-base">
                  Adjust the cutting plane angle and position to slice your model
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="retro-card">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Download className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="font-display text-2xl">3. Export</CardTitle>
                <CardDescription className="text-base">
                  Download each part as a separate GLB file ready to use
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      <section className="relative py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-display font-black mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Create your first project and start cutting 3D models like a pro!
          </p>
          <Button
            onClick={() => navigate({ to: '/new-project' })}
            size="lg"
            className="retro-button bg-secondary text-secondary-foreground font-bold text-xl px-8 py-6"
          >
            Create Your First Project
          </Button>
        </div>
      </section>
    </div>
  );
}
