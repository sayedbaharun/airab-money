import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold gradient-text">AIRAB Money</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The definitive AI-powered financial media platform for the Arab world and GCC region.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Essential Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/articles" className="text-muted-foreground hover:text-primary transition-colors">Articles</Link></li>
              <li><Link to="/markets" className="text-muted-foreground hover:text-primary transition-colors">Markets</Link></li>
              <li><Link to="/presenters" className="text-muted-foreground hover:text-primary transition-colors">Presenters</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail size={16} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">hello@airabmoney.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  Dubai Internet City<br />
                  Dubai, UAE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © {currentYear} AIRAB Money. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
