import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-400 bg-clip-text text-transparent mb-4">
              AmbitfulAI
            </div>

            <div className="space-y-2 text-gray-300">
              <div className="flex items-center dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                hello@futurepathfinder.com
              </div>
              <div className="flex items-center dark:text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                San Francisco, CA
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-300">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href="#home"
                  className="dark:text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="#opportunities"
                  className="dark:text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="#categories"
                  className="dark:text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="dark:text-gray-400 hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="dark:text-gray-400 hover:text-blue-400 transition-colors"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 dark:text-gray-300">
              Stay Updated
            </h3>
            <p className="dark:text-gray-300 mb-4 text-sm">
              Get the latest opportunities delivered to your inbox
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-gradient-to-r from-blue-600 to-[#3498db]/100 hover:from-blue-700 hover:to-[#3498db]/700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 FuturePathFinder. All rights reserved.
          </div>

          <div className="flex space-x-4">
            <Link
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="!text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
