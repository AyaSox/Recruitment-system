# ?? Language & ?? Notification Systems - Complete Explanation

## Overview

Your ATS system has **two powerful real-time features**:

1. **?? Multi-Language Support** - South African 11 official languages
2. **?? Real-Time Notifications** - SignalR-based instant updates

---

## ?? LANGUAGE SYSTEM

### Architecture Flow

```
???????????????????????????????????????????????????????????????
?                    LANGUAGE SELECTOR                         ?
???????????????????????????????????????????????????????????????
                              ?
                              ?
???????????????????????????????????????????????????????????????
?              LocalizationContext (React)                     ?
?  • Manages current language state                           ?
?  • Provides translation functions (t, translate)            ?
?  • Caches translations in state                             ?
?  • Persists language choice in localStorage                 ?
???????????????????????????????????????????????????????????????
                              ?
                              ?
???????????????????????????????????????????????????????????????
?           LocalizationService (React)                        ?
?  • Makes API calls to backend                               ?
?  • Manages localStorage for language preference             ?
?  • Handles translation key lookups                          ?
???????????????????????????????????????????????????????????????
                              ?
                              ?
???????????????????????????????????????????????????????????????
?        LocalizationController (Backend API)                  ?
?  • GET /api/localization/languages                          ?
?  • GET /api/localization/translations/{languageCode}        ?
?  • GET /api/localization/translate/{key}/{languageCode}     ?
???????????????????????????????????????????????????????????????
                              ?
                              ?
???????????????????????????????????????????????????????????????
?         LocalizationService (Backend)                        ?
?  • In-memory translation dictionary                         ?
?  • Supports 11 South African languages                      ?
?  • Returns fallback to English if translation missing       ?
???????????????????????????????????????????????????????????????
```

### Components Breakdown

#### 1?? **LanguageSelector Component** (`LanguageSelector.tsx`)

**Purpose**: UI dropdown that lets users pick their language

**Key Features**:
```typescript
// Access localization context
const { currentLanguage, supportedLanguages, setLanguage, loading } = useLocalization();

// When user selects a language
const handleLanguageChange = async (languageCode: string) => {
  await setLanguage(languageCode); // Updates context + localStorage + API
};
```

**UI Display**:
```typescript
<Select value={currentLanguage}>
  {supportedLanguages.filter(lang => lang.isEnabled).map(language => (
    <MenuItem value={language.code}>
      {language.flag} {language.nativeName}
    </MenuItem>
  ))}
</Select>
```

**Visual Example**:
```
???????????????????????????
? ???? English        ?    ?  ? Dropdown showing current language
???????????????????????????
         ? Click
         ?
???????????????????????????
? ???? English             ?
? ???? Afrikaans           ?
? ???? isiZulu             ?  ? List of all 11 languages
? ???? isiXhosa            ?
? ???? Sesotho             ?
? ...                     ?
???????????????????????????
```

---

#### 2?? **LocalizationContext** (`LocalizationContext.tsx`)

**Purpose**: React Context that provides translation state to entire app

**State Management**:
```typescript
const [currentLanguage, setCurrentLanguage] = useState('en');
const [supportedLanguages, setSupportedLanguages] = useState<Language[]>([]);
const [translations, setTranslations] = useState<Record<string, string>>({});
const [loading, setLoading] = useState(true);
```

**Key Functions**:

1. **`initializeLocalization()`** - Runs on app startup
   ```typescript
   // Load from localStorage
   const savedLanguage = localizationService.getCurrentLanguage();
   setCurrentLanguage(savedLanguage);
   
   // Fetch supported languages from API
   const languages = await localizationService.getSupportedLanguages();
   setSupportedLanguages(languages);
   
   // Load translations for current language
   const initialTranslations = await localizationService.getTranslations(savedLanguage);
   setTranslations(initialTranslations);
   ```

2. **`setLanguage()`** - Changes the active language
   ```typescript
   // Update service (saves to localStorage)
   localizationService.setCurrentLanguage(languageCode);
   
   // Update state
   setCurrentLanguage(languageCode);
   
   // Load new translations
   const newTranslations = await localizationService.getTranslations(languageCode);
   setTranslations(newTranslations);
   
   // Update HTML lang attribute
   document.documentElement.lang = languageCode;
   ```

3. **`t()` - Translate function** (Synchronous, cached)
   ```typescript
   const t = (key: string): string => {
     return translations[key] || key; // Fallback to key if not found
   };
   
   // Usage in components:
   <h1>{t('app.welcome')}</h1>  // "Welcome" or "Welkom" or "Sawubona"
   ```

4. **`translate()` - Async translate** (Fetches from API)
   ```typescript
   const translate = async (key: string): Promise<string> => {
     return await localizationService.translate(key, currentLanguage);
   };
   ```

---

#### 3?? **LocalizationService (Frontend)** (`localization.service.ts`)

**Purpose**: Handles API calls and localStorage management

**Key Methods**:

```typescript
class LocalizationService {
  private currentLanguage: string = 'en';
  
  // Get supported languages from backend
  async getSupportedLanguages(): Promise<Language[]> {
    const response = await api.get('/localization/languages');
    return response.data;
  }
  
  // Get all translations for a language
  async getTranslations(languageCode: string): Promise<Record<string, string>> {
    const response = await api.get(`/localization/translations/${languageCode}`);
    return response.data;
  }
  
  // Translate a single key
  async translate(key: string, languageCode: string): Promise<string> {
    const response = await api.get(`/localization/translate/${key}/${languageCode}`);
    return response.data;
  }
  
  // Save/load from localStorage
  setCurrentLanguage(languageCode: string) {
    this.currentLanguage = languageCode;
    localStorage.setItem('language', languageCode);
  }
  
  getCurrentLanguage(): string {
    return localStorage.getItem('language') || 'en';
  }
}
```

---

#### 4?? **Backend LocalizationService** (`LocalizationService.cs`)

**Purpose**: Stores and serves translations for 11 South African languages

**Supported Languages**:
```csharp
var languages = new List<LanguageDto>
{
    new() { Code = "en",  Name = "English",   NativeName = "English",    Flag = "????" },
    new() { Code = "af",  Name = "Afrikaans", NativeName = "Afrikaans",  Flag = "????" },
    new() { Code = "zu",  Name = "Zulu",      NativeName = "isiZulu",    Flag = "????" },
    new() { Code = "xh",  Name = "Xhosa",     NativeName = "isiXhosa",   Flag = "????" },
    new() { Code = "st",  Name = "Sesotho",   NativeName = "Sesotho",    Flag = "????" },
    new() { Code = "tn",  Name = "Setswana",  NativeName = "Setswana",   Flag = "????" },
    new() { Code = "nso", Name = "Sepedi",    NativeName = "Sepedi",     Flag = "????" },
    new() { Code = "ts",  Name = "Tsonga",    NativeName = "Xitsonga",   Flag = "????" },
    new() { Code = "ss",  Name = "Swati",     NativeName = "siSwati",    Flag = "????" },
    new() { Code = "ve",  Name = "Venda",     NativeName = "Tshivenda",  Flag = "????" },
    new() { Code = "nr",  Name = "Ndebele",   NativeName = "isiNdebele", Flag = "????" }
};
```

**Translation Storage** (In-Memory Dictionary):
```csharp
private static Dictionary<string, Dictionary<string, string>> _translations = new()
{
    ["en"] = new() 
    {
        { "app.name", "ATS Recruitment System" },
        { "app.welcome", "Welcome" },
        { "app.login", "Login" },
        { "jobs.title", "Job Opportunities" },
        { "jobs.apply", "Apply Now" }
        // ... 50+ translation keys
    },
    ["af"] = new() 
    {
        { "app.name", "ATS Werwingstelsel" },
        { "app.welcome", "Welkom" },
        { "app.login", "Teken aan" },
        { "jobs.title", "Werksgeleenthede" },
        { "jobs.apply", "Doen nou aansoek" }
    },
    ["zu"] = new() 
    {
        { "app.name", "Uhlelo Lokuqasha" },
        { "app.welcome", "Sawubona" },
        { "app.login", "Ngena" },
        { "jobs.title", "Amathuba Emisebenzi" },
        { "jobs.apply", "Faka isicelo manje" }
    }
    // ... translations for all 11 languages
};
```

**Key Methods**:
```csharp
public async Task<List<LanguageDto>> GetSupportedLanguagesAsync()
{
    return languages; // Returns all 11 languages
}

public async Task<Dictionary<string, string>> GetTranslationsAsync(string languageCode)
{
    if (_translations.ContainsKey(languageCode))
        return _translations[languageCode];
    
    return _translations["en"]; // Fallback to English
}

public async Task<string> TranslateKeyAsync(string key, string languageCode)
{
    var translations = await GetTranslationsAsync(languageCode);
    return translations.ContainsKey(key) ? translations[key] : key;
}
```

---

### Usage in Components

**Example: Translate UI text**
```typescript
import { useLocalization } from '../context/LocalizationContext';

function JobsPage() {
  const { t } = useLocalization();
  
  return (
    <div>
      <h1>{t('jobs.title')}</h1>
      {/* English: "Job Opportunities" */}
      {/* Afrikaans: "Werksgeleenthede" */}
      {/* Zulu: "Amathuba Emisebenzi" */}
      
      <Button>{t('jobs.apply')}</Button>
      {/* English: "Apply Now" */}
      {/* Afrikaans: "Doen nou aansoek" */}
      {/* Zulu: "Faka isicelo manje" */}
    </div>
  );
}
```

---

## ?? NOTIFICATION SYSTEM

### Architecture Flow

```
???????????????????????????????????????????????????????????????
?                  USER ACTION (e.g., Apply for job)          ?
???????????????????????????????????????????????????????????????
                              ?
                              ?
???????????????????????????????????????????????????????????????
?            Backend Controller (ApplicationsController)       ?
?  • Processes application submission                         ?
?  • Calls NotificationService                                ?
???????????????????????????????????????????????????????????????
                              ?
                              ?
???????????????????????????????????????????????????????????????
?              NotificationService (Backend)                   ?
?  • Identifies target users (applicant, recruiters)          ?
?  • Calls SignalR Hub                                        ?
???????????????????????????????????????????????????????????????
                              ?
                              ?
???????????????????????????????????????????????????????????????
?                 NotificationHub (SignalR)                    ?
?  • Maintains active WebSocket connections                   ?
?  • Routes notifications to connected users                  ?
???????????????????????????????????????????????????????????????
                              ?
                              ?
???????????????????????????????????????????????????????????????
?        NotificationService (Frontend - SignalR Client)       ?
?  • Receives notification via WebSocket                      ?
?  • Calls registered callbacks                               ?
???????????????????????????????????????????????????????????????
                              ?
                              ?
???????????????????????????????????????????????????????????????
?          NotificationCenter Component (React)                ?
?  • Displays real-time notification                          ?
?  • Shows Snackbar popup                                     ?
?  • Updates notification list                                ?
?  • Shows badge count on bell icon                           ?
???????????????????????????????????????????????????????????????
```

### Components Breakdown

#### 1?? **NotificationCenter Component** (`NotificationCenter.tsx`)

**Purpose**: UI for displaying and managing notifications

**Key Features**:

```typescript
// State management
const [notifications, setNotifications] = useState<Notification[]>([]);
const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // For dropdown menu
const [snackbarOpen, setSnackbarOpen] = useState(false); // For toast notification
const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
```

**Initialization** (on component mount):
```typescript
useEffect(() => {
  // 1. Start SignalR connection
  notificationService.start();
  
  // 2. Subscribe to notifications
  const unsubscribe = notificationService.subscribe((notification) => {
    const newNotification = {
      id: Date.now().toString(),
      ...notification,
      timestamp: new Date(notification.timestamp),
      read: false
    };
    
    // Add to notifications list
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show snackbar popup
    setCurrentNotification(newNotification);
    setSnackbarOpen(true);
  });
  
  // 3. Cleanup on unmount
  return () => {
    unsubscribe();
    notificationService.stop();
  };
}, []);
```

**Visual Elements**:

1. **Bell Icon with Badge**:
   ```typescript
   <IconButton onClick={handleNotificationClick}>
     <Badge badgeContent={unreadCount} color="error">
       <NotificationsIcon />
     </Badge>
   </IconButton>
   ```
   
   Visual:
   ```
   ??(3)  ? Red badge shows 3 unread notifications
   ```

2. **Notification Dropdown Menu**:
   ```typescript
   <Menu anchorEl={anchorEl} open={Boolean(anchorEl)}>
     <Box sx={{ p: 2 }}>
       <Typography variant="h6">
         Notifications ({unreadCount} unread)
       </Typography>
     </Box>
     
     <List>
       {notifications.slice(0, 10).map(notification => (
         <ListItem
           key={notification.id}
           onClick={() => markAsRead(notification.id)}
           sx={{ bgcolor: notification.read ? 'transparent' : 'action.hover' }}
         >
           <ListItemAvatar>
             {getNotificationIcon(notification.type)}
           </ListItemAvatar>
           <ListItemText
             primary={formatNotificationMessage(notification)}
             secondary={notification.timestamp.toLocaleString()}
           />
           {!notification.read && <Badge color="primary" variant="dot" />}
         </ListItem>
       ))}
     </List>
   </Menu>
   ```
   
   Visual:
   ```
   ??????????????????????????????????????????
   ?  Notifications (3 unread)              ?
   ??????????????????????????????????????????
   ?  ?? Application for Developer updated  ?  • ? Blue dot = unread
   ?     to: Interview                      ?
   ?     2:30 PM                            ?
   ??????????????????????????????????????????
   ?  ?? Interview reminder: Designer       ?  • 
   ?     at 3:00 PM                         ?
   ??????????????????????????????????????????
   ?  ?? New application from John Doe      ?
   ?     for Manager                        ?
   ?     12:15 PM                           ?
   ??????????????????????????????????????????
   ```

3. **Snackbar Popup** (Real-time toast):
   ```typescript
   <Snackbar
     open={snackbarOpen}
     autoHideDuration={6000}
     onClose={handleSnackbarClose}
     anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
   >
     <Alert severity="info" variant="filled">
       <Typography variant="body2" fontWeight="bold">
         {currentNotification?.type.replace(/_/g, ' ').toUpperCase()}
       </Typography>
       <Typography variant="body2">
         {formatNotificationMessage(currentNotification)}
       </Typography>
     </Alert>
   </Snackbar>
   ```
   
   Visual:
   ```
                        ?????????????????????????????????
                        ? ?? APPLICATION STATUS UPDATE ?
                        ? Application for Developer     ?
                        ? updated to: Interview         ?
                        ?                          [X]  ?
                        ?????????????????????????????????
                                 ? Appears top-right for 6 seconds
   ```

**Notification Types & Icons**:
```typescript
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'application_status_update':
      return <AssignmentIcon color="primary" />;    // ?? Blue
    case 'interview_reminder':
      return <ScheduleIcon color="warning" />;      // ?? Orange
    case 'new_application':
      return <PersonIcon color="success" />;        // ?? Green
    case 'job_approved':
      return <WorkIcon color="info" />;             // ?? Cyan
    default:
      return <CircleIcon color="action" />;         // ? Gray
  }
};
```

**Message Formatting**:
```typescript
const formatNotificationMessage = (notification: Notification) => {
  switch (notification.type) {
    case 'application_status_update':
      return `Application for ${notification.data.jobTitle} updated to: ${notification.data.status}`;
      
    case 'interview_reminder':
      return `Interview reminder: ${notification.data.jobTitle} at ${new Date(notification.data.scheduledDate).toLocaleString()}`;
      
    case 'new_application':
      return `New application from ${notification.data.candidateName} for ${notification.data.jobTitle}`;
      
    case 'job_approved':
      return `Job posting approved: ${notification.data.jobTitle}`;
      
    default:
      return notification.data.message || 'New notification';
  }
};
```

---

#### 2?? **NotificationService (Frontend)** (`notification.service.ts`)

**Purpose**: SignalR client that maintains WebSocket connection to backend

**Key Properties**:
```typescript
class NotificationService {
  private connection: signalR.HubConnection | null = null;
  private callbacks: NotificationCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
}
```

**Connection Setup**:
```typescript
private initializeConnection() {
  // Get backend URL
  const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:7129/api';
  const baseUrl = apiUrl.replace('/api', ''); // Remove /api
  
  this.connection = new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/notificationHub`, {
      // Include auth token
      accessTokenFactory: () => localStorage.getItem('token') || '',
      
      // Support multiple transport methods (fallback support)
      transport: signalR.HttpTransportType.WebSockets | 
                 signalR.HttpTransportType.ServerSentEvents | 
                 signalR.HttpTransportType.LongPolling,
      
      skipNegotiation: false,
      withCredentials: false
    })
    .withAutomaticReconnect({
      nextRetryDelayInMilliseconds: (retryContext) => {
        if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
          // Exponential backoff: 1s, 2s, 4s, 8s, 16s
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        }
        return null; // Stop retrying
      }
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();
  
  this.setupEventHandlers();
}
```

**Event Handlers**:
```typescript
private setupEventHandlers() {
  // 1. Receive notification from backend
  this.connection.on('ReceiveNotification', (notification: Notification) => {
    console.log('Notification received:', notification);
    
    // Notify all subscribers (e.g., NotificationCenter component)
    this.callbacks.forEach(callback => callback(notification));
  });
  
  // 2. Connection established
  this.connection.on('Connected', (message: any) => {
    console.log('SignalR Connected:', message);
  });
  
  // 3. Reconnecting (after disconnect)
  this.connection.onreconnecting((error) => {
    console.warn('SignalR reconnecting...', error);
    this.reconnectAttempts++;
  });
  
  // 4. Reconnected successfully
  this.connection.onreconnected((connectionId) => {
    console.log('SignalR reconnected with connection ID:', connectionId);
    this.reconnectAttempts = 0;
  });
  
  // 5. Connection closed
  this.connection.onclose((error) => {
    console.log('SignalR connection closed:', error);
    
    // Auto-reconnect if authenticated
    const token = localStorage.getItem('token');
    if (token && this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => this.start(), 5000);
    }
  });
}
```

**Public Methods**:

1. **`start()`** - Establish connection:
   ```typescript
   async start(): Promise<void> {
     // Check authentication
     const token = localStorage.getItem('token');
     if (!token) {
       console.log('No auth token, skipping SignalR connection');
       return;
     }
     
     if (!this.connection) {
       this.initializeConnection();
     }
     
     try {
       if (this.connection?.state === signalR.HubConnectionState.Disconnected) {
         await this.connection?.start();
         console.log('? SignalR Connected successfully');
         this.reconnectAttempts = 0;
       }
     } catch (error) {
       console.error('? Error connecting to SignalR:', error);
       
       // Retry with exponential backoff
       if (this.reconnectAttempts < this.maxReconnectAttempts) {
         this.reconnectAttempts++;
         setTimeout(() => this.start(), 5000);
       }
     }
   }
   ```

2. **`subscribe()`** - Register notification callback:
   ```typescript
   subscribe(callback: NotificationCallback): () => void {
     this.callbacks.push(callback);
     
     // Return unsubscribe function
     return () => {
       const index = this.callbacks.indexOf(callback);
       if (index > -1) {
         this.callbacks.splice(index, 1);
       }
     };
   }
   ```

3. **`joinGroup()`** - Join notification group:
   ```typescript
   async joinGroup(groupName: string): Promise<void> {
     await this.connection?.invoke('JoinGroup', groupName);
     console.log(`Joined group: ${groupName}`);
   }
   ```

4. **`markAsRead()`** - Mark notification as read:
   ```typescript
   async markAsRead(notificationId: string): Promise<void> {
     await this.connection?.invoke('MarkAsRead', notificationId);
   }
   ```

---

#### 3?? **NotificationHub (Backend)** (`NotificationHub.cs`)

**Purpose**: SignalR Hub that manages WebSocket connections and routes notifications

**Connection Management**:
```csharp
// Store user ID ? connection ID mapping
private static readonly ConcurrentDictionary<string, string> UserConnections = new();

public override async Task OnConnectedAsync()
{
    // Get user ID from JWT token
    var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    if (!string.IsNullOrEmpty(userId))
    {
        // Store connection
        UserConnections[userId] = Context.ConnectionId;
        _logger.LogInformation("User {UserId} connected with connection ID {ConnectionId}", 
                               userId, Context.ConnectionId);
        
        // Add to user-specific group
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
        
        // Notify client of successful connection
        await Clients.Caller.SendAsync("Connected", new { 
            message = "Successfully connected to notification hub" 
        });
    }
    
    await base.OnConnectedAsync();
}

public override async Task OnDisconnectedAsync(Exception? exception)
{
    var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    
    if (!string.IsNullOrEmpty(userId))
    {
        UserConnections.TryRemove(userId, out _);
        _logger.LogInformation("User {UserId} disconnected", userId);
    }
    
    await base.OnDisconnectedAsync(exception);
}
```

**Hub Methods** (Callable from client):
```csharp
// Join a notification group (e.g., "job_123", "application_456")
public async Task JoinGroup(string groupName)
{
    await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    _logger.LogInformation("Connection {ConnectionId} joined group {GroupName}", 
                           Context.ConnectionId, groupName);
}

// Leave a notification group
public async Task LeaveGroup(string groupName)
{
    await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    _logger.LogInformation("Connection {ConnectionId} left group {GroupName}", 
                           Context.ConnectionId, groupName);
}

// Mark notification as read
public async Task MarkAsRead(string notificationId)
{
    // Update notification status in database (future enhancement)
    _logger.LogInformation("Notification {NotificationId} marked as read", notificationId);
}
```

---

#### 4?? **NotificationService (Backend)** (`NotificationService.cs`)

**Purpose**: Service that sends notifications through SignalR Hub

**Key Methods**:

1. **Send to Specific User**:
   ```csharp
   public async Task SendToUserAsync(string userId, string type, object data)
   {
       try
       {
           await _hubContext.Clients.Group($"user_{userId}")
               .SendAsync("ReceiveNotification", new
               {
                   type,
                   data,
                   timestamp = DateTime.UtcNow
               });
           
           _logger.LogInformation("Notification of type {Type} sent to user {UserId}", 
                                  type, userId);
       }
       catch (Exception ex)
       {
           _logger.LogError(ex, "Error sending notification to user {UserId}", userId);
       }
   }
   ```

2. **Send to Group**:
   ```csharp
   public async Task SendToGroupAsync(string groupName, string type, object data)
   {
       await _hubContext.Clients.Group(groupName)
           .SendAsync("ReceiveNotification", new
           {
               type,
               data,
               timestamp = DateTime.UtcNow
           });
   }
   ```

3. **Send to All Users**:
   ```csharp
   public async Task SendToAllAsync(string type, object data)
   {
       await _hubContext.Clients.All
           .SendAsync("ReceiveNotification", new
           {
               type,
               data,
               timestamp = DateTime.UtcNow
           });
   }
   ```

4. **Specific Notification Types**:
   ```csharp
   // Application status update
   public async Task SendApplicationStatusUpdateAsync(
       string userId, int applicationId, string status, string jobTitle)
   {
       await SendToUserAsync(userId, "application_status_update", new
       {
           applicationId,
           status,
           jobTitle,
           message = $"Your application for {jobTitle} has been updated to: {status}"
       });
   }
   
   // Interview reminder
   public async Task SendInterviewReminderAsync(
       string userId, int interviewId, DateTime scheduledDate, string jobTitle)
   {
       await SendToUserAsync(userId, "interview_reminder", new
       {
           interviewId,
           scheduledDate,
           jobTitle,
           message = $"Reminder: Interview for {jobTitle} scheduled at {scheduledDate:g}"
       });
   }
   
   // New application notification (to recruiter)
   public async Task SendNewApplicationNotificationAsync(
       string recruiterId, int applicationId, string candidateName, string jobTitle)
   {
       await SendToUserAsync(recruiterId, "new_application", new
       {
           applicationId,
           candidateName,
           jobTitle,
           message = $"New application from {candidateName} for {jobTitle}"
       });
   }
   ```

---

### Real-World Example Flow

**Scenario**: User applies for a job

```
????????????????????????????????????????????????????????????????????
? STEP 1: User submits application                                ?
? Frontend: JobApplyPage ? ApplicationService.submitApplication() ?
????????????????????????????????????????????????????????????????????
                              ?
                              ?
????????????????????????????????????????????????????????????????????
? STEP 2: Backend processes application                            ?
? ApplicationsController ? ApplicationService.CreateAsync()        ?
?   • Saves application to database                               ?
?   • Gets job details                                            ?
?   • Gets recruiter IDs                                          ?
????????????????????????????????????????????????????????????????????
                              ?
                              ?
????????????????????????????????????????????????????????????????????
? STEP 3: Send notification to applicant                          ?
? NotificationService.SendApplicationStatusUpdateAsync(            ?
?   userId: "applicant-123",                                      ?
?   applicationId: 456,                                           ?
?   status: "Applied",                                            ?
?   jobTitle: "Software Developer"                               ?
? )                                                               ?
????????????????????????????????????????????????????????????????????
                              ?
                              ?
????????????????????????????????????????????????????????????????????
? STEP 4: SignalR Hub routes notification                         ?
? NotificationHub ? Clients.Group("user_applicant-123")          ?
?   .SendAsync("ReceiveNotification", {                           ?
?     type: "application_status_update",                          ?
?     data: {                                                     ?
?       applicationId: 456,                                       ?
?       status: "Applied",                                        ?
?       jobTitle: "Software Developer",                          ?
?       message: "Your application for Software Developer..."    ?
?     },                                                          ?
?     timestamp: "2024-12-10T14:30:00Z"                          ?
?   })                                                            ?
????????????????????????????????????????????????????????????????????
                              ?
                              ?
????????????????????????????????????????????????????????????????????
? STEP 5: Frontend receives notification                          ?
? NotificationService.connection.on("ReceiveNotification", ...)   ?
?   • Calls registered callbacks                                  ?
????????????????????????????????????????????????????????????????????
                              ?
                              ?
????????????????????????????????????????????????????????????????????
? STEP 6: NotificationCenter updates UI                           ?
?   • Adds to notifications array                                 ?
?   • Shows snackbar popup                                        ?
?   • Updates bell icon badge count                               ?
????????????????????????????????????????????????????????????????????
                              ?
                              ?
????????????????????????????????????????????????????????????????????
? STEP 7: Send notification to recruiters                         ?
? NotificationService.SendNewApplicationNotificationAsync(         ?
?   recruiterId: "recruiter-789",                                 ?
?   applicationId: 456,                                           ?
?   candidateName: "John Doe",                                    ?
?   jobTitle: "Software Developer"                               ?
? )                                                               ?
????????????????????????????????????????????????????????????????????
                              ?
                              ?
????????????????????????????????????????????????????????????????????
? STEP 8: Recruiter sees notification instantly                   ?
?   ?? Bell icon shows (1) badge                                  ?
?   Snackbar appears: "New application from John Doe..."          ?
????????????????????????????????????????????????????????????????????
```

---

## ?? Configuration

### Frontend Environment Variables

```env
# .env.development
VITE_API_URL=https://localhost:7129/api
```

### Backend Program.cs Registration

```csharp
// Add services
builder.Services.AddScoped<ILocalizationService, LocalizationService>();
builder.Services.AddScoped<INotificationService, NotificationService>();

// Add SignalR
builder.Services.AddSignalR();

// Configure app
app.MapHub<NotificationHub>("/notificationHub");
```

---

## ?? Key Benefits

### Language System:
? **11 South African Languages** - Inclusive and accessible
? **Instant Language Switching** - No page reload required
? **localStorage Persistence** - Language choice saved between sessions
? **Fallback to English** - Graceful degradation if translation missing
? **Easy to Extend** - Add more languages by updating dictionary

### Notification System:
? **Real-Time Updates** - Instant notifications via WebSockets
? **Auto-Reconnect** - Handles connection drops gracefully
? **User-Specific Routing** - Notifications only go to relevant users
? **Group Support** - Can send to groups (e.g., all recruiters)
? **Visual Feedback** - Snackbar popups + badge counts
? **Mark as Read** - Track notification read status
? **Multiple Transport Methods** - Falls back if WebSockets blocked

---

## ?? Troubleshooting

### Language System Issues:

**Problem**: Language not changing
```typescript
// Check localStorage
console.log(localStorage.getItem('language'));

// Check if API is returning translations
const translations = await localizationService.getTranslations('af');
console.log(translations);

// Verify context is providing translations
const { translations, currentLanguage } = useLocalization();
console.log({ translations, currentLanguage });
```

**Problem**: Translations showing keys instead of text
```typescript
// Ensure translation exists in backend dictionary
// Check: ATSRecruitSys.Server/Services/LocalizationService.cs
// Look for: _translations["af"]["your.key"]
```

---

### Notification System Issues:

**Problem**: No notifications appearing

1. **Check SignalR Connection**:
   ```typescript
   console.log(notificationService.getConnectionState());
   // Should output: "Connected"
   ```

2. **Check Browser Console** for connection errors:
   ```
   ? SignalR Connected successfully
   ? Error connecting to SignalR: 401 Unauthorized
   ```

3. **Verify Auth Token**:
   ```typescript
   console.log(localStorage.getItem('token'));
   // Should have a JWT token
   ```

4. **Check Backend Logs**:
   ```
   User user-123 connected with connection ID abc-def
   Notification of type application_status_update sent to user user-123
   ```

**Problem**: Notifications delayed or not real-time

1. **Check Network Tab** in browser:
   - Look for WebSocket connection to `/notificationHub`
   - Should see "101 Switching Protocols"

2. **Check Transport Method**:
   ```typescript
   // In NotificationService.ts
   // Should prioritize WebSockets:
   transport: signalR.HttpTransportType.WebSockets
   ```

---

## ?? Summary

### Language System:
- **Frontend**: `LanguageSelector` ? `LocalizationContext` ? `LocalizationService` ? API
- **Backend**: `LocalizationController` ? `LocalizationService` ? In-memory dictionary
- **Storage**: localStorage + React state
- **Languages**: 11 South African official languages

### Notification System:
- **Frontend**: `NotificationCenter` ? `NotificationService` (SignalR client)
- **Backend**: `NotificationService` ? `NotificationHub` (SignalR hub)
- **Transport**: WebSockets (with fallback to SSE/Long Polling)
- **Features**: Real-time, user-specific, group support, auto-reconnect

Both systems work seamlessly together to provide a **multilingual, real-time user experience**! ??
