'use client';

import { forwardRef, ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps } from 'framer-motion';
import { LucideIcon, Check, Sparkles, Star, Users, Heart, Shield } from 'lucide-react';

/* ==============================================
   BUTTONS
   ============================================== */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: ReactNode;
}

const buttonStyles: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  outline: 'btn-outline',
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon: Icon, iconPosition = 'left', loading, children, className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`${buttonStyles[variant]} ${buttonSizes[size]} ${className}`}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
            Loading...
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
          </>
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';

interface LinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  children: ReactNode;
  external?: boolean;
}

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  children,
  external,
}: LinkButtonProps) {
  const classes = `${buttonStyles[variant]} ${buttonSizes[size]} ${className}`;
  
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </Link>
  );
}

/* ==============================================
   BADGES
   ============================================== */

type BadgeVariant = 'default' | 'purple' | 'pink' | 'success' | 'new';

interface BadgeProps {
  variant?: BadgeVariant;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
  default: 'badge',
  purple: 'badge badge-purple',
  pink: 'badge badge-pink',
  success: 'badge badge-success',
  new: 'badge badge-new',
};

export function Badge({ variant = 'default', icon: Icon, children, className = '' }: BadgeProps) {
  return (
    <span className={`${badgeStyles[variant]} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}

/* ==============================================
   CARDS
   ============================================== */

type CardVariant = 'default' | 'glass' | 'featured' | 'dark';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  children: ReactNode;
}

const cardStyles: Record<CardVariant, string> = {
  default: 'card-default',
  glass: 'card-glass',
  featured: 'card-featured',
  dark: 'card-dark',
};

export function Card({ variant = 'default', hover = true, children, className = '', ...props }: CardProps) {
  return (
    <div className={`${cardStyles[variant]} ${hover ? '' : 'card-no-hover'} ${className}`} {...props}>
      {children}
    </div>
  );
}

/* ==============================================
   SECTION HEADING
   ============================================== */

interface SectionHeadingProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({ badge, badgeIcon, title, subtitle, align = 'center', className = '' }: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left';
  
  return (
    <div className={`section-heading max-w-2xl ${alignClass} ${className}`}>
      {badge && (
        <Badge variant="purple" icon={badgeIcon} className="mb-4 inline-flex">
          {badge}
        </Badge>
      )}
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}

/* ==============================================
   TRUST STRIP
   ============================================== */

interface TrustItem {
  icon: ReactNode | string;
  text: string;
}

interface TrustStripProps {
  items?: TrustItem[];
  className?: string;
}

const defaultTrustItems: TrustItem[] = [
  { icon: <Star className="w-4 h-4 text-amber-500 fill-amber-500" />, text: '5-star reviews' },
  { icon: <Users className="w-4 h-4 text-[var(--purple)]" />, text: '200+ nursing students' },
  { icon: <Shield className="w-4 h-4 text-emerald-500" />, text: '30-day money-back' },
  { icon: <Heart className="w-4 h-4 text-[var(--pink)]" />, text: 'Made by a student' },
];

export function TrustStrip({ items = defaultTrustItems, className = '' }: TrustStripProps) {
  return (
    <div className={`trust-strip ${className}`}>
      <div className="trust-strip-inner">
        {items.map((item, i) => (
          <div key={i} className="trust-item">
            {typeof item.icon === 'string' ? (
              <span className="text-lg">{item.icon}</span>
            ) : (
              item.icon
            )}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==============================================
   FEATURE GRID ITEM
   ============================================== */

interface FeatureItemProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureItem({ icon, title, description, className = '' }: FeatureItemProps) {
  return (
    <div className={`feature-item ${className}`}>
      <div className="feature-icon">
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

/* ==============================================
   FEATURE CHECKLIST
   ============================================== */

interface FeatureCheckProps {
  features: string[];
  className?: string;
}

export function FeatureCheck({ features, className = '' }: FeatureCheckProps) {
  return (
    <ul className={`feature-checklist ${className}`}>
      {features.map((feature, i) => (
        <li key={i} className="feature-check-item">
          <div className="check-circle">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

/* ==============================================
   TOOL CARD (for Featured Tools section)
   ============================================== */

interface ToolCardProps {
  icon: LucideIcon;
  iconGradient?: string;
  title: string;
  description: string;
  features: string[];
  href: string;
  buttonText: string;
  isPro?: boolean;
  proHref?: string;
  className?: string;
}

export function ToolCard({
  icon: Icon,
  iconGradient = 'from-[var(--lavender)] to-[var(--purple)]',
  title,
  description,
  features,
  href,
  buttonText,
  isPro,
  proHref,
  className = '',
}: ToolCardProps) {
  return (
    <Card className={`tool-card ${className}`}>
      <div className={`tool-icon bg-gradient-to-br ${iconGradient}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="tool-title">{title}</h3>
      <p className="tool-description">{description}</p>
      <FeatureCheck features={features} className="mb-6" />
      <LinkButton
        href={isPro && proHref ? proHref : href}
        variant="primary"
        className="w-full"
      >
        {isPro ? 'Open Tool' : buttonText}
      </LinkButton>
    </Card>
  );
}

/* ==============================================
   WHY THIS WORKS ITEM
   ============================================== */

interface WhyItemProps {
  emoji: string;
  title: string;
  description: string;
}

export function WhyItem({ emoji, title, description }: WhyItemProps) {
  return (
    <div className="why-item">
      <span className="why-emoji">{emoji}</span>
      <h3 className="why-title">{title}</h3>
      <p className="why-description">{description}</p>
    </div>
  );
}

/* ==============================================
   CTA BLOCK
   ============================================== */

interface CTABlockProps {
  title: string;
  subtitle?: string;
  primaryButton: {
    text: string;
    href: string;
    icon?: LucideIcon;
  };
  secondaryButton?: {
    text: string;
    href: string;
    icon?: LucideIcon;
  };
  isPro?: boolean;
  proButton?: {
    text: string;
    href: string;
    icon?: LucideIcon;
  };
  className?: string;
}

export function CTABlock({
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  isPro,
  proButton,
  className = '',
}: CTABlockProps) {
  return (
    <section className={`cta-block ${className}`}>
      <div className="cta-content">
        <h2 className="cta-title">{title}</h2>
        {subtitle && <p className="cta-subtitle">{subtitle}</p>}
        <div className="cta-buttons">
          {isPro && proButton ? (
            <LinkButton href={proButton.href} variant="primary" size="lg" icon={proButton.icon || Sparkles}>
              {proButton.text}
            </LinkButton>
          ) : (
            <>
              <LinkButton href={primaryButton.href} variant="primary" size="lg" icon={primaryButton.icon || Sparkles}>
                {primaryButton.text}
              </LinkButton>
              {secondaryButton && (
                <LinkButton href={secondaryButton.href} variant="ghost" size="lg" icon={secondaryButton.icon}>
                  {secondaryButton.text}
                </LinkButton>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/* ==============================================
   ANIMATED WRAPPERS
   ============================================== */

interface AnimatedProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
}

export function FadeIn({ children, delay = 0, className = '', ...props }: AnimatedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '', ...props }: AnimatedProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ==============================================
   ICON BOX
   ============================================== */

interface IconBoxProps {
  icon: LucideIcon;
  gradient?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconBoxSizes = {
  sm: 'w-10 h-10 rounded-xl',
  md: 'w-14 h-14 rounded-2xl',
  lg: 'w-16 h-16 rounded-2xl',
};

export function IconBox({ icon: Icon, gradient = 'from-[var(--lavender)] to-[var(--purple)]', size = 'md', className = '' }: IconBoxProps) {
  return (
    <div className={`${iconBoxSizes[size]} bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md ${className}`}>
      <Icon className={size === 'sm' ? 'w-5 h-5 text-white' : size === 'md' ? 'w-6 h-6 text-white' : 'w-7 h-7 text-white'} />
    </div>
  );
}
