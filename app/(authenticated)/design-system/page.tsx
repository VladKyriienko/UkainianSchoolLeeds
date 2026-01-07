import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Corporate Design System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A professional design system with customizable theme colors, built
            using shadcn/ui components and Tailwind CSS.
          </p>
        </div>

        {/* Color Palette */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Theme Colors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="w-full h-20 bg-primary rounded-lg mb-4"></div>
                <h3 className="font-semibold">Primary</h3>
                <p className="text-sm text-muted-foreground">
                  Main brand color
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="w-full h-20 bg-secondary rounded-lg mb-4"></div>
                <h3 className="font-semibold">Secondary</h3>
                <p className="text-sm text-muted-foreground">Secondary color</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="w-full h-20 bg-accent rounded-lg mb-4"></div>
                <h3 className="font-semibold">Accent</h3>
                <p className="text-sm text-muted-foreground">Accent color</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="w-full h-20 bg-muted rounded-lg mb-4"></div>
                <h3 className="font-semibold">Muted</h3>
                <p className="text-sm text-muted-foreground">
                  Muted background
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Buttons
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Primary
              </h3>
              <Button>Default</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Secondary
              </h3>
              <Button variant="secondary">Secondary</Button>
              <Button variant="secondary" size="sm">
                Small
              </Button>
              <Button variant="secondary" size="lg">
                Large
              </Button>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Outline
              </h3>
              <Button variant="outline">Outline</Button>
              <Button variant="outline" size="sm">
                Small
              </Button>
              <Button variant="outline" size="lg">
                Large
              </Button>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Other
              </h3>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Badges
          </h2>
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Professional Card</CardTitle>
                <CardDescription>
                  A clean, professional card design perfect for corporate
                  applications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card demonstrates the new design system with proper
                  spacing, typography, and color usage.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" size="sm" className="w-full">
                  Take Action
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-accent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Featured Card</CardTitle>
                  <Badge variant="secondary">Featured</Badge>
                </div>
                <CardDescription>
                  A highlighted card with accent border and orange badge.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Priority:</span>
                    <Badge variant="secondary">High</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Edit
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Card</CardTitle>
                <CardDescription>
                  Example of form elements within a card.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Enter your name" />
                <Input placeholder="Enter your email" type="email" />
              </CardContent>
              <CardFooter>
                <Button className="w-full">Submit</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Typography
          </h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Heading 1</h1>
              <p className="text-muted-foreground">
                Large heading for main titles
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-foreground">
                Heading 2
              </h2>
              <p className="text-muted-foreground">Section headings</p>
            </div>
            <div>
              <h3 className="text-2xl font-medium text-foreground">
                Heading 3
              </h3>
              <p className="text-muted-foreground">Subsection headings</p>
            </div>
            <div>
              <p className="text-foreground">
                Body text with proper contrast and readability. This
                demonstrates the main content typography with good line height
                and spacing.
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Small text for captions, labels, and secondary information.
              </p>
            </div>
          </div>
        </section>

        {/* Business Analysis Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">
            Business Analysis Demo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs">+</Badge>
                  <span className="text-sm">Proprietary Systems</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-xs">+</Badge>
                  <span className="text-sm">Customer Service Reputation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="text-xs">+</Badge>
                  <span className="text-sm">In-house IT Capability</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    →
                  </Badge>
                  <span className="text-sm">More Targeted Approach</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    →
                  </Badge>
                  <span className="text-sm">System Integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    →
                  </Badge>
                  <span className="text-sm">Process Automation</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}
