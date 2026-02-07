'use client';

import { PageWrapper } from '@/components/common/PageWrapper';
import { COOKIES_POLICY_CONTENT } from '@/content/cookies-policy';
import { useLanguage } from '@/providers/language-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CookiesPolicyPage() {
  const { language } = useLanguage();
  const content = COOKIES_POLICY_CONTENT[language];

  return (
    <PageWrapper
      title={{
        en: COOKIES_POLICY_CONTENT.en.pageTitle,
        uk: COOKIES_POLICY_CONTENT.uk.pageTitle
      }}
      description={{
        en: COOKIES_POLICY_CONTENT.en.pageDescription,
        uk: COOKIES_POLICY_CONTENT.uk.pageDescription
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <p className="text-sm text-muted-foreground">{content.lastUpdated}</p>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>{content.sections.introduction.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.sections.introduction.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* What Are Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>{content.sections.whatAreCookies.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.sections.whatAreCookies.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* How We Use Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>{content.sections.howWeUseCookies.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.sections.howWeUseCookies.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Types of Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>{content.sections.typesOfCookies.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {content.sections.typesOfCookies.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
            <div className="space-y-4 mt-6">
              <div>
                <h3 className="font-semibold mb-2">{content.sections.typesOfCookies.types.essential.title}</h3>
                <p className="text-muted-foreground">{content.sections.typesOfCookies.types.essential.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{content.sections.typesOfCookies.types.analytics.title}</h3>
                <p className="text-muted-foreground">{content.sections.typesOfCookies.types.analytics.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{content.sections.typesOfCookies.types.preferences.title}</h3>
                <p className="text-muted-foreground">{content.sections.typesOfCookies.types.preferences.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managing Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>{content.sections.managingCookies.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.sections.managingCookies.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Third-Party Cookies */}
        <Card>
          <CardHeader>
            <CardTitle>{content.sections.thirdPartyCookies.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.sections.thirdPartyCookies.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <CardHeader>
            <CardTitle>{content.sections.changesToPolicy.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {content.sections.changesToPolicy.content.map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Contact Us */}
        <Card>
          <CardHeader>
            <CardTitle>{content.sections.contactUs.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{content.sections.contactUs.content}</p>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
