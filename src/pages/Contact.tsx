import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const serviceTypes = [
  {
    id: "export",
    label: "Export Management",
    description: "Help with exporting products",
  },
  {
    id: "import",
    label: "Import Consulting",
    description: "Guidance on import operations",
  },
  {
    id: "logistics",
    label: "Logistics Coordination",
    description: "Freight and delivery solutions",
  },
  {
    id: "documentation",
    label: "Documentation & Compliance",
    description: "Paperwork and regulatory support",
  },
  {
    id: "sourcing",
    label: "Product Sourcing",
    description: "Finding specific products",
  },
  { id: "other", label: "Other", description: "Something else" },
];

const budgetRanges = [
  { id: "under-10k", label: "Under $10,000" },
  { id: "10k-50k", label: "$10,000 - $50,000" },
  { id: "50k-100k", label: "$50,000 - $100,000" },
  { id: "100k-500k", label: "$100,000 - $500,000" },
  { id: "over-500k", label: "Over $500,000" },
];

const timelines = [
  { id: "asap", label: "As soon as possible" },
  { id: "1-month", label: "Within 1 month" },
  { id: "1-3-months", label: "1-3 months" },
  { id: "3-6-months", label: "3-6 months" },
  { id: "flexible", label: "Flexible / Not sure" },
];

const Contact = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    serviceType: "",
    budget: "",
    timeline: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 4;

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1 && !formData.serviceType) {
      newErrors.serviceType = "Please select a service type";
    }
    if (currentStep === 2 && !formData.budget) {
      newErrors.budget = "Please select a budget range";
    }
    if (currentStep === 3 && !formData.timeline) {
      newErrors.timeline = "Please select a timeline";
    }
    if (currentStep === 4) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Quote Request Submitted!",
      description: "We'll get back to you within 24 hours.",
    });

    navigate("/thank-you");
  };

  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-4">
              Contact Us
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Let's Start Your Journey
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Fill out the form below and our team will get back to you within
              24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Multi-Step Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-3xl p-6 lg:p-10 shadow-card border border-border/50">
                {/* Progress Bar */}
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className="flex items-center">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                            step >= s
                              ? "bg-accent text-accent-foreground"
                              : "bg-secondary text-muted-foreground"
                          )}
                        >
                          {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                        </div>
                        {s < 4 && (
                          <div
                            className={cn(
                              "w-16 lg:w-24 h-1 mx-2 rounded transition-all",
                              step > s ? "bg-accent" : "bg-secondary"
                            )}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Service</span>
                    <span>Budget</span>
                    <span>Timeline</span>
                    <span>Details</span>
                  </div>
                </div>

                {/* Step 1: Service Type */}
                {step === 1 && (
                  <div className="animate-fade-in">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                      What service are you interested in?
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Select the service that best describes your needs.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {serviceTypes.map((service) => (
                        <button
                          key={service.id}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              serviceType: service.id,
                            })
                          }
                          className={cn(
                            "p-4 rounded-xl border-2 text-left transition-all",
                            formData.serviceType === service.id
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                          )}
                        >
                          <div className="font-semibold text-foreground">
                            {service.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {service.description}
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.serviceType && (
                      <p className="text-destructive text-sm mt-4">
                        {errors.serviceType}
                      </p>
                    )}
                  </div>
                )}

                {/* Step 2: Budget */}
                {step === 2 && (
                  <div className="animate-fade-in">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                      What's your estimated budget?
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      This helps us tailor our recommendations to your needs.
                    </p>
                    <div className="space-y-3">
                      {budgetRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() =>
                            setFormData({ ...formData, budget: range.id })
                          }
                          className={cn(
                            "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                            formData.budget === range.id
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                          )}
                        >
                          <span className="font-medium text-foreground">
                            {range.label}
                          </span>
                          {formData.budget === range.id && (
                            <CheckCircle className="w-5 h-5 text-accent" />
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.budget && (
                      <p className="text-destructive text-sm mt-4">
                        {errors.budget}
                      </p>
                    )}
                  </div>
                )}

                {/* Step 3: Timeline */}
                {step === 3 && (
                  <div className="animate-fade-in">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                      What's your timeline?
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      When do you need to get started?
                    </p>
                    <div className="space-y-3">
                      {timelines.map((timeline) => (
                        <button
                          key={timeline.id}
                          onClick={() =>
                            setFormData({ ...formData, timeline: timeline.id })
                          }
                          className={cn(
                            "w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between",
                            formData.timeline === timeline.id
                              ? "border-accent bg-accent/5"
                              : "border-border hover:border-accent/50"
                          )}
                        >
                          <span className="font-medium text-foreground">
                            {timeline.label}
                          </span>
                          {formData.timeline === timeline.id && (
                            <CheckCircle className="w-5 h-5 text-accent" />
                          )}
                        </button>
                      ))}
                    </div>
                    {errors.timeline && (
                      <p className="text-destructive text-sm mt-4">
                        {errors.timeline}
                      </p>
                    )}
                  </div>
                )}

                {/* Step 4: Contact Details */}
                {step === 4 && (
                  <div className="animate-fade-in">
                    <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                      Your Contact Details
                    </h2>
                    <p className="text-muted-foreground mb-8">
                      Tell us how to reach you.
                    </p>
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className={cn(
                              "w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all",
                              errors.name
                                ? "border-destructive"
                                : "border-border"
                            )}
                            placeholder="John Doe"
                          />
                          {errors.name && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                company: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                            placeholder="Your Company"
                          />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            className={cn(
                              "w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all",
                              errors.email
                                ? "border-destructive"
                                : "border-border"
                            )}
                            placeholder="john@example.com"
                          />
                          {errors.email && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Phone *
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className={cn(
                              "w-full px-4 py-3 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all",
                              errors.phone
                                ? "border-destructive"
                                : "border-border"
                            )}
                            placeholder="+1 234 567 8900"
                          />
                          {errors.phone && (
                            <p className="text-destructive text-sm mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Additional Details
                        </label>
                        <textarea
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              message: e.target.value,
                            })
                          }
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                          placeholder="Tell us more about your requirements..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={prevStep}
                    disabled={step === 1}
                    className={cn(step === 1 && "invisible")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>

                  {step < 4 ? (
                    <Button variant="accent" size="lg" onClick={nextStep}>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      variant="accent"
                      size="lg"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card rounded-2xl p-6 shadow-card border border-border/50">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Address
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        123 Trade Center, Business Bay
                        <br />
                        Dubai, UAE
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Phone
                      </h4>
                      <a
                        href="tel:+971501234567"
                        className="text-muted-foreground text-sm hover:text-accent transition-colors"
                      >
                        +971 50 123 4567
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Email
                      </h4>
                      <a
                        href="mailto:info@globaltrade.com"
                        className="text-muted-foreground text-sm hover:text-accent transition-colors"
                      >
                        info@globaltrade.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        Working Hours
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        Sun - Thu: 9:00 AM - 6:00 PM
                        <br />
                        Fri - Sat: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-primary rounded-2xl p-6">
                <h3 className="font-heading text-lg font-bold text-primary-foreground mb-4">
                  Need Immediate Help?
                </h3>
                <div className="space-y-3">
                  <a
                    href="tel:+971501234567"
                    className="flex items-center gap-3 bg-primary-foreground/10 rounded-xl p-4 hover:bg-primary-foreground/20 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-accent" />
                    <span className="text-primary-foreground font-medium">
                      Call Us Now
                    </span>
                  </a>
                  <a
                    href="https://wa.me/971501234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-primary-foreground/10 rounded-xl p-4 hover:bg-primary-foreground/20 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5 text-accent" />
                    <span className="text-primary-foreground font-medium">
                      WhatsApp Chat
                    </span>
                  </a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-secondary rounded-2xl overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178509324792!2d55.26585607538467!3d25.197201977706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43348a67e24b%3A0xff45e502e1ceb7e2!2sBusiness%20Bay%20-%20Dubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1704123456789!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
