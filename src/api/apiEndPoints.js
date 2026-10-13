// Api end points is to get particular data
export const getSettings = "settings";

// auth apis 
export const userLogin = "auth/login";
export const userLoginWithGoogle = "auth/social/login";
export const sendEmailOtp = "auth/send-email-otp";
export const verifyEmailOtp = "auth/otp/verify";
export const registerComplete = "auth/register/complete";
export const resetPassword = "auth/reset-password";
export const updateProfile = "auth/profile";
export const logout = "auth/logout";
export const getUserDetails = "auth/user";
export const deleteAccount = "auth/delete-account";


// home page apis 
export const banners = "banners";
export const propertiesDropdown = "properties/dropdown";
export const homepage = "homepage";
export const events = "events";
export const eventInquiries = "event-inquiries";

// about-us page api
export const about = "about";

// rooms / properties / hotels apis 
export const rooms = "properties/rooms";
export const properties = "properties";
export const propertyDetails = "property-details";
export const reviews = "reviews";

// bookings apis
export const bookingQuote = "bookings/quote";
export const lockBooking = "bookings/lock";
export const confirmBooking = "bookings/confirm";
export const bookingWithPaymentGateway = "bookings/create-with-payment";
export const bookings = "bookings";

// help & support page api
export const helpSupport = "help-support";

// blogs page api
export const blogCategories = "blog-categories";
export const blogs = "blogs";

// language translations 
export const translations = "translations";

// currencies 
export const currencies = "currencies";

// currencies 
export const review = "reviews";

// queries 
export const queries = "queries";

// offers
export const offers = "offers";

// nearby places
export const nearbyPlaces = "properties";

// account security
export const changePassword = "auth/change-password";

// transactions
export const transactions = "transactions";

// notifications
export const getNotifications = "get-notifications";
export const getNotificationPreferences = "get-notification-preferences";
export const updateNotificationPreferences = "update-notification-preferences";


// ===================================== Multi phase apis start =====================================

export const partnerRegister = "partner/auth/register";
export const searchSuggestion = "search/suggest";
export const homePageSections = "homepage/sections";
export const favorites = "favorites";
export const rules = "properties/rule-filters";


