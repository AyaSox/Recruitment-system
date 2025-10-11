import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Typography,
  TextField,
  Avatar,
  Fab,
  Collapse,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  AssignmentOutlined,
  PeopleOutline,
  FeaturedPlayListOutlined,
  TrendingUpOutlined,
  LockOutlined,
  EmailOutlined,
  PhoneAndroidOutlined,
  FlashOnOutlined,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  response: string;
}

const ChatWidget: React.FC = () => {
  const { authState } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now(),
        text: `Hi${authState.user?.firstName ? ` ${authState.user.firstName}` : ''}! I'm your ATS assistant. How can I help you today?`,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, authState.user]);

  const quickActions: QuickAction[] = [
    {
      label: 'How to apply?',
      icon: <AssignmentOutlined />,
      response: `To apply for a job:\n\n1. Browse available jobs (no login required!)\n2. Click on a job you like\n3. Click "Apply Now"\n4. Upload your CV (PDF, DOC, or DOCX)\n5. Fill in the simple 6-field form\n6. Submit!\n\nYou'll receive email updates on your application status. No account needed!`,
    },
    {
      label: 'User roles',
      icon: <PeopleOutline />,
      response: `Our system has different user roles:\n\nAdmin - Full system access, manages users and all features\n\nRecruiter - Creates jobs, reviews applications, manages recruitment\n\nHiring Manager - Reviews applications, provides feedback\n\nApplicant - Can browse and apply for jobs\n\nExternal candidates don't need accounts - just apply directly!`,
    },
    {
      label: 'System features',
      icon: <FeaturedPlayListOutlined />,
      response: `Key features:\n\n- Quick Apply - No registration needed\n- Email Notifications - Stay updated on your application\n- Application Tracking - Recruiters can track all candidates\n- Funnel View - Visual pipeline for applications\n- Reports & Analytics - Track recruitment metrics\n- Audit Logs - Complete activity history\n- User Management - Admin can manage team members\n\nAll with a modern green theme!`,
    },
    {
      label: 'Application stages',
      icon: <TrendingUpOutlined />,
      response: `Applications move through these stages:\n\n1. New - Just submitted\n2. Screening - Being reviewed\n3. Interview - Scheduled for interview\n4. Offer - Job offer extended\n5. Hired - Successfully hired!\n6. Rejected - Not selected this time\n\nYou'll get email updates at each stage!`,
    },
    {
      label: 'Login issues?',
      icon: <LockOutlined />,
      response: `Having trouble logging in?\n\nFor Applicants:\n- You don't need to login! Just browse jobs and apply.\n\nFor Staff:\n- Make sure you're using your correct email and password\n- Contact your admin if you forgot your password\n- Default admin login: admin@atsrecruitsys.com / Admin@123\n\nStill stuck? Contact your system administrator.`,
    },
    {
      label: 'Email notifications',
      icon: <EmailOutlined />,
      response: `You'll receive emails for:\n\n- Application submission confirmation\n- Status changes (screening, interview, etc.)\n- Interview invitations\n- Final decisions\n\nMake sure to check your spam folder if you don't see our emails!`,
    },
    {
      label: 'Mobile friendly?',
      icon: <PhoneAndroidOutlined />,
      response: `Yes! Our system is fully responsive:\n\n- Works on phones and tablets\n- Optimized for desktop\n- Modern, clean interface\n- Fast and smooth\n\nApply on the go or from your desk!`,
    },
    {
      label: 'Quick Actions',
      icon: <FlashOnOutlined />,
      response: `Staff members see Quick Actions on the homepage:\n\n- Dashboard - View overview\n- Post New Job - Create job posting\n- Applications - Review candidates\n- Funnel View - Track pipeline\n- Reports - View analytics\n- User Management (Admin only)\n\nOne-click access to common tasks!`,
    },
  ];

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Greetings
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
      return `Hello! I'm here to help you with the ATS system. Ask me anything about:\n\n- How to apply for jobs\n- System features\n- User roles\n- Application tracking\n- Or just say "help" for common questions!`;
    }

    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return `I can help you with:\n\n- Application process\n- User roles and permissions\n- System features\n- Application stages\n- Login assistance\n- Email notifications\n- Mobile usage\n- Quick Actions\n\nClick any quick action button below or ask me directly!`;
    }

    // Apply/Application
    if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
      return quickActions[0].response;
    }

    // User roles
    if (lowerMessage.includes('role') || lowerMessage.includes('admin') || lowerMessage.includes('recruiter')) {
      return quickActions[1].response;
    }

    // Features
    if (lowerMessage.includes('feature') || lowerMessage.includes('what does') || lowerMessage.includes('can i')) {
      return quickActions[2].response;
    }

    // Stages
    if (lowerMessage.includes('stage') || lowerMessage.includes('status') || lowerMessage.includes('process')) {
      return quickActions[3].response;
    }

    // Login
    if (lowerMessage.includes('login') || lowerMessage.includes('sign in') || lowerMessage.includes('password')) {
      return quickActions[4].response;
    }

    // Email
    if (lowerMessage.includes('email') || lowerMessage.includes('notification')) {
      return quickActions[5].response;
    }

    // Mobile
    if (lowerMessage.includes('mobile') || lowerMessage.includes('phone') || lowerMessage.includes('responsive')) {
      return quickActions[6].response;
    }

    // Quick Actions
    if (lowerMessage.includes('quick action') || lowerMessage.includes('homepage')) {
      return quickActions[7].response;
    }

    // CV/Resume
    if (lowerMessage.includes('cv') || lowerMessage.includes('resume')) {
      return `CV/Resume Upload:\n\n- Accepted formats: PDF, DOC, DOCX\n- Max size: 5MB\n- Make sure your CV is up to date!\n\nUpload during the application process - it's quick and easy!`;
    }

    // Jobs
    if (lowerMessage.includes('job') && (lowerMessage.includes('find') || lowerMessage.includes('browse'))) {
      return `To browse jobs:\n\n1. Click "Browse Jobs" on homepage\n2. View all available positions\n3. No login required!\n4. Click any job to see full details\n5. Apply with just your CV and basic info\n\nIt's that simple!`;
    }

    // Export
    if (lowerMessage.includes('export') || lowerMessage.includes('excel') || lowerMessage.includes('report')) {
      return `Export Features (Staff only):\n\nReports Page:\n- Export all statistics to Excel\n- Click "Export to Excel" button\n- Get comprehensive report\n\nAudit Logs:\n- Export activity history\n- Complete audit trail\n\nPerfect for record-keeping and analysis!`;
    }

    // Theme
    if (lowerMessage.includes('theme') || lowerMessage.includes('color') || lowerMessage.includes('green')) {
      return `Our modern green theme!\n\n- Professional forest green (#2e7d32)\n- Fresh and unique\n- Light & dark mode support\n- Easy on the eyes\n- Modern gradients\n\nToggle between light/dark mode using the theme switcher in the top menu!`;
    }

    // Thanks
    if (lowerMessage.match(/(thank|thx|thanks)/)) {
      return `You're welcome! Feel free to ask if you need anything else. Happy recruiting!`;
    }

    // Default response
    return `I'm here to help! Try asking about:\n\n- How to apply for jobs\n- User roles and permissions\n- System features\n- Application stages\n- Login help\n- Email notifications\n\nOr click a quick action button below!`;
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getAIResponse(inputMessage),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleQuickAction = (action: QuickAction) => {
    const userMessage: Message = {
      id: Date.now(),
      text: action.label,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: action.response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          boxShadow: '0 8px 24px rgba(46, 125, 50, 0.3)',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(46, 125, 50, 0.4)',
          },
          zIndex: 1000,
        }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>

      {/* Chat Window */}
      <Collapse in={isOpen} timeout={300}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 380,
            maxWidth: 'calc(100vw - 48px)',
            height: 600,
            maxHeight: 'calc(100vh - 150px)',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden',
            zIndex: 999,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
          }}
        >
          {/* Chat Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                <BotIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  ATS Assistant
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Always here to help
                </Typography>
              </Box>
            </Stack>
            <IconButton
              size="small"
              onClick={() => setIsOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: '#f8faf9',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.isBot ? 'flex-start' : 'flex-end',
                  gap: 1,
                }}
              >
                {message.isBot && (
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 32,
                      height: 32,
                      mt: 'auto',
                    }}
                  >
                    <BotIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                )}

                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    maxWidth: '75%',
                    bgcolor: message.isBot ? 'white' : 'primary.main',
                    color: message.isBot ? 'text.primary' : 'white',
                    borderRadius: 2,
                    borderTopLeftRadius: message.isBot ? 0 : 2,
                    borderTopRightRadius: message.isBot ? 2 : 0,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      lineHeight: 1.6,
                    }}
                  >
                    {message.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      opacity: 0.7,
                      fontSize: '0.7rem',
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Paper>

                {!message.isBot && (
                  <Avatar
                    sx={{
                      bgcolor: 'secondary.main',
                      width: 32,
                      height: 32,
                      mt: 'auto',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 18 }} />
                  </Avatar>
                )}
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Quick questions:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {quickActions.slice(0, 4).map((action, index) => (
                  <Chip
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    onClick={() => handleQuickAction(action)}
                    size="small"
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'white',
                        '& .MuiChip-icon': {
                          color: 'white',
                        },
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Divider />

          {/* Input Area */}
          <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={inputMessage.trim() === ''}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '&:disabled': {
                    bgcolor: 'action.disabledBackground',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};

export default ChatWidget;
