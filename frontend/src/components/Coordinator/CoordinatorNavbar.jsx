import React from 'react';
import { motion } from 'framer-motion';
import { Bus, User, LogOut, Settings, MessageSquare, BarChart3, Users, Home, Shield } from 'lucide-react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '../ui/navigation-menu';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';

const CoordinatorNavbar = ({ user, onNavigate, activeView, unreadNotifications = 0 }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Overview and quick coordination stats'
    },
    {
      id: 'trips',
      label: 'Trips',
      icon: Bus,
      description: 'Manage and monitor transportation trips',
      subItems: [
        { id: 'trips-overview', label: 'Trip Overview', description: 'View all active and scheduled trips' },
        { id: 'trips-create', label: 'Create New Trip', description: 'Schedule a new transportation trip' },
        { id: 'trips-monitoring', label: 'Live Monitoring', description: 'Real-time trip tracking and updates' }
      ]
    },
    {
      id: 'passengers',
      label: 'Passengers',
      icon: Users,
      description: 'Manage passenger information and assignments'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      description: 'Analytics and performance reporting'
    }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-neutral-200'
          : 'bg-white shadow-soft'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <Bus className="w-8 h-8 text-primary-600" />
              <div className="ml-3">
                <span className="text-xl font-bold text-primary-600">SafeGo</span>
                <span className="text-xs text-neutral-500 block -mt-1">Coordinator</span>
              </div>
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.id}>
                  {item.subItems ? (
                    <>
                      <NavigationMenuTrigger className="h-10 px-4 py-2 text-sm font-medium transition-colors hover:text-primary-600 data-[state=open]:text-primary-600">
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="w-[400px] p-4">
                          <div className="text-sm font-medium text-neutral-900 mb-2">{item.label}</div>
                          <div className="grid gap-3">
                            {item.subItems.map((subItem) => (
                              <NavigationMenuLink key={subItem.id} asChild>
                                <motion.a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onNavigate(subItem.id === 'trips-overview' ? 'trips' : subItem.id);
                                  }}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                  whileHover={{ x: 4 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="text-sm font-medium leading-none">{subItem.label}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                    {subItem.description}
                                  </p>
                                </motion.a>
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <motion.button
                        onClick={() => onNavigate(item.id)}
                        className={`h-10 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:text-primary-600 hover:bg-primary-50 ${
                          activeView === item.id ? 'text-primary-600 bg-primary-50' : 'text-neutral-700'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.label}
                      </motion.button>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => onNavigate('notifications')}
              >
                <MessageSquare className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  >
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </motion.span>
                )}
              </Button>
            </motion.div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div
                  className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-neutral-50 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-neutral-900 truncate max-w-24">
                      {user?.name || 'Coordinator'}
                    </div>
                    <div className="text-xs text-neutral-500">Coordinator Account</div>
                  </div>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Preferences</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate('help')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-error-600 focus:text-error-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default CoordinatorNavbar;
