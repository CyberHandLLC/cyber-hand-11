"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { getThemeStyle } from "@/lib/theme-utils";
import { PageLayout, SectionContainer } from "@/components/custom/page-layout";
import { AnimatedElement } from "@/lib/animation-utils";
import { Button } from "@/components/ui/button";
import { Input, Textarea, FormGroup } from "@/components/ui/form-elements";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";

export default function ContactPage() {
  const { theme } = useTheme();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = "Email address is invalid";
    }
    
    if (!formState.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission - in a real application, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({
      name: '',
      email: '',
      company: '',
      phone: '',
      message: ''
    });
  };
  
  return (
    <PageLayout>
      {/* Hero section */}
      <section className="py-24 md:py-32">
        <SectionContainer>
          <div className="max-w-4xl mx-auto">
            <AnimatedElement animation="fadeInUp" delay={0.1}>
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6 text-center">
                Get in Touch
              </h1>
              
              <div className="mb-8 w-24 h-1 bg-cyan-500 mx-auto"></div>
              
              <p className={`text-lg md:text-xl mb-12 text-center ${getThemeStyle('text-secondary', theme)}`}>
                Ready to transform your digital presence? We're here to help you every step of the way.
              </p>
            </AnimatedElement>
            
            {/* Two column layout for form and contact info */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              {/* Contact form */}
              <div className="lg:col-span-3">
                <AnimatedElement animation="fadeIn" delay={0.3}>
                  <div className="rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm p-6 md:p-8">
                    {isSubmitted ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-6">
                          <Icons.CheckCircle className="h-8 w-8 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-white mb-4">Message Sent!</h2>
                        <p className={`mb-8 ${getThemeStyle('text-secondary', theme)}`}>
                          Thank you for reaching out. We'll get back to you as soon as possible.
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setIsSubmitted(false)}
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-xl font-semibold text-white mb-6">Contact Form</h2>
                        
                        <form onSubmit={handleSubmit}>
                          <FormGroup>
                            <Input
                              label="Name"
                              name="name"
                              placeholder="Your name"
                              value={formState.name}
                              onChange={handleChange}
                              error={errors.name}
                              required
                            />
                            
                            <Input
                              label="Email"
                              name="email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={formState.email}
                              onChange={handleChange}
                              error={errors.email}
                              required
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                label="Company"
                                name="company"
                                placeholder="Your company (optional)"
                                value={formState.company}
                                onChange={handleChange}
                              />
                              
                              <Input
                                label="Phone"
                                name="phone"
                                placeholder="Your phone (optional)"
                                value={formState.phone}
                                onChange={handleChange}
                              />
                            </div>
                            
                            <Textarea
                              label="Message"
                              name="message"
                              placeholder="How can we help you?"
                              value={formState.message}
                              onChange={handleChange}
                              error={errors.message}
                              required
                            />
                            
                            <div className="mt-6">
                              <Button
                                type="submit"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? "Sending..." : "Send Message"}
                                {!isSubmitting && <Icons.ArrowRight className="ml-2 h-4 w-4" />}
                              </Button>
                            </div>
                          </FormGroup>
                        </form>
                      </>
                    )}
                  </div>
                </AnimatedElement>
              </div>
              
              {/* Contact information */}
              <div className="lg:col-span-2">
                <AnimatedElement animation="fadeIn" delay={0.5}>
                  <div className="space-y-8">
                    {/* Why contact us */}
                    <div className="rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm p-6">
                      <h2 className="text-xl font-semibold text-white mb-4">Why Contact Us</h2>
                      
                      <div className="space-y-4">
                        {[
                          "Get a free consultation for your digital needs",
                          "Request a quote for your next project",
                          "Schedule a website audit to improve performance",
                          "Discuss partnership opportunities"
                        ].map((item, index) => (
                          <div key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/50 flex items-center justify-center mt-1 mr-3">
                              <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                            </div>
                            <p className={getThemeStyle('text-secondary', theme)}>{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Contact info */}
                    <div className="rounded-lg border border-gray-800/30 bg-gradient-to-br from-black/60 to-transparent backdrop-blur-sm p-6">
                      <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mr-4">
                            <Icons.Mail className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-sm text-white/60">Email</p>
                            <a href="mailto:info@cyber-hand.com" className="text-white hover:text-cyan-400 transition-colors">
                              info@cyber-hand.com
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center mr-4">
                            <Icons.Phone className="h-5 w-5 text-cyan-400" />
                          </div>
                          <div>
                            <p className="text-sm text-white/60">Phone</p>
                            <a href="tel:+12345678900" className="text-white hover:text-cyan-400 transition-colors">
                              +1 (234) 567-8900
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedElement>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>
    </PageLayout>
  );
}
