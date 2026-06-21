import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/gstat-logo.png"
                alt="GSTAT eLearning Platform"
                width={80}
                height={80}
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-blue-200 mb-4">
              Making learning fun and engaging for children ages 2-7 with Professor Whiskers.
            </p>
            <div className="flex gap-3">
              <Link href="#" className="w-9 h-9 rounded-full bg-blue-700/50 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-blue-700/50 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-blue-700/50 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-blue-700/50 hover:bg-primary flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-blue-200 hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="#curriculum" className="text-sm text-blue-200 hover:text-primary transition-colors">Curriculum</Link></li>
              <li><Link href="#games" className="text-sm text-blue-200 hover:text-primary transition-colors">Games</Link></li>
              <li><Link href="/login/school" className="text-sm text-blue-200 hover:text-primary transition-colors">School Zone</Link></li>
              <li><Link href="#subscription" className="text-sm text-blue-200 hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm text-blue-200 hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="#" className="text-sm text-blue-200 hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="#" className="text-sm text-blue-200 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm text-blue-200 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm text-blue-200 hover:text-primary transition-colors">Parent Guide</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm text-blue-200">info@gstatmobile.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm text-blue-200">+2347037018216</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-700/50 text-center">
          <p className="text-sm text-blue-200">
            © {new Date().getFullYear()} GSTAT eLearning Platform. Powered by gstatmobile.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
