import api from "./apiMiddleware";
import * as apiEndPoints from "../apiEndPoints";

// 1. Settings Api
export const getSettingsApi = async () => {
  try {
    const response = await api.get(apiEndPoints.getSettings);

    if (response.status !== 200) {
      throw new Error("Failed to fetch settings");
    }

    return response?.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
};

// 2. login api -> email/phone
export const userLoginApi = async ({
  identifier = "",
  dial_code = "",
  password = "",
  fcm_token = "",
  platform = "",
}) => {
  try {
    const formData = new FormData();
    if (identifier) formData.append("identifier", identifier);
    if (dial_code) formData.append("dial_code", dial_code);
    if (password) formData.append("password", password);
    if (fcm_token) formData.append("fcm_token", fcm_token);
    if (platform) formData.append("platform", 'web');

    const response = await api.post(apiEndPoints.userLogin, formData);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 3. login api -> google
export const userLoginWithGoogleApi = async ({
  provider = "",
  id_token = "",
  name = "",
  fcm_token = "",
  platform = "",
}) => {
  try {
    const formData = new FormData();
    if (provider) formData.append("provider", provider);
    if (id_token) formData.append("id_token", id_token);
    if (name) formData.append("name", name);
    if (fcm_token) formData.append("fcm_token", fcm_token);
    if (platform) formData.append("platform", 'web');

    const response = await api.post(apiEndPoints.userLoginWithGoogle, formData);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 4. send email otp api
export const sendEmailOtpApi = async ({
  email = "",
  purpose = "",
}) => {
  try {
    const formData = new FormData();
    if (email) formData.append("email", email);
    if (purpose) formData.append("purpose", purpose);

    const response = await api.post(apiEndPoints.sendEmailOtp, formData);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 5. verify email otp api
export const verifyOtpApi = async ({
  identifier = "",
  otp = "",
  purpose = ""
}) => {
  try {
    const formData = new FormData();
    if (identifier) formData.append("identifier", identifier);
    if (otp) formData.append("otp", otp);
    if (purpose) formData.append("purpose", purpose);

    const response = await api.post(apiEndPoints.verifyEmailOtp, formData);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 6. register user api
export const registerUserApi = async ({
  name = "",
  email = "",
  country_code = "",
  dial_code = "",
  phone = "",
  password = "",
  referral_code = "",
  verification_token = "",
  firebase_id_token = "",
  fcm_token = "",
  platform = "",
  password_confirmation = "",
}) => {
  try {
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (email) formData.append("email", email);
    if (country_code) formData.append("country_code", country_code);
    if (dial_code) formData.append("dial_code", dial_code);
    if (phone) formData.append("phone", phone);
    if (password) formData.append("password", password);
    if (referral_code) formData.append("referral_code", referral_code);
    if (verification_token) formData.append("verification_token", verification_token);
    if (firebase_id_token) formData.append("firebase_id_token", firebase_id_token);
    if (fcm_token) formData.append("fcm_token", fcm_token);
    if (platform) formData.append("platform", platform);
    if (password_confirmation) formData.append("password_confirmation", password_confirmation);

    const response = await api.post(apiEndPoints.registerComplete, formData);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 7. reset password api
export const resetPasswordApi = async ({
  identifier = "",
  dial_code = "",
  password = "",
  verification_token = "",
  firebase_id_token = "",
  password_confirmation = ""
}) => {
  try {
    const formData = new FormData();
    if (identifier) formData.append("identifier", identifier);
    if (dial_code) formData.append("dial_code", dial_code);
    if (password) formData.append("password", password);
    if (verification_token) formData.append("verification_token", verification_token);
    if (firebase_id_token) formData.append("firebase_id_token", firebase_id_token);
    if (password_confirmation) formData.append("password_confirmation", password_confirmation);

    const response = await api.post(apiEndPoints.resetPassword, formData);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 8. update profile api
export const updateProfileApi = async ({
  name = "",
  profile = "",
  email = "",
  verification_token = "",
  country_code = "",
  dial_code = "",
  phone = "",
  firebase_id_token = "",
  referral_code = "",
}) => {
  try {
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (profile) formData.append("profile", profile);
    if (email) formData.append("email", email);
    if (verification_token) formData.append("verification_token", verification_token);
    if (country_code) formData.append("country_code", country_code);
    if (dial_code) formData.append("dial_code", dial_code);
    if (phone) formData.append("phone", phone);
    if (firebase_id_token) formData.append("firebase_id_token", firebase_id_token);
    if (referral_code) formData.append("referral_code", referral_code);

    const response = await api.post(apiEndPoints.updateProfile, formData);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 9. logout api
export const logoutApi = async ({
  fcm_token = "",
}) => {
  try {
    const formData = new FormData();
    if (fcm_token) formData.append("fcm_token", fcm_token);

    const response = await api.post(apiEndPoints.logout, formData);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 10. get user details api
export const getUserDetailsApi = async () => {
  try {
    const response = await api.get(apiEndPoints.getUserDetails);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 11. get banners api
export const getBannersApi = async ({
  country_id,
}) => {
  try {
    const params = {};
    if (country_id) params.country_id = country_id;

    const response = await api.get(apiEndPoints.banners, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 12. get properties dropdown api
export const getPropertiesDropdownApi = async ({
  limit = "",
  offset = "",
  search = "",
  country_id,
  lat,
  long
}) => {
  try {
    const params = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (search) params.search = search;
    if (country_id) params.country_id = country_id;
    if (lat) params.lat = lat;
    if (long) params.long = long;
    const response = await api.get(apiEndPoints.propertiesDropdown, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 13. get rooms api
export const getRoomsApi = async ({
  room_slug,
  adults,
  amenities,
  check_in,
  check_out,
  children,
  limit,
  max_price,
  min_price,
  offset,
  property_slug,
  rooms,
  sort_by,
}) => {
  try {
    const params = {};
    if (room_slug) params.room_slug = room_slug;
    if (adults) params.adults = adults;
    if (amenities) params.amenities = amenities;
    if (check_in) params.check_in = check_in;
    if (check_out) params.check_out = check_out;
    if (children) params.children = children;
    if (limit) params.limit = limit;
    if (max_price) params.max_price = max_price;
    if (min_price) params.min_price = min_price;
    if (offset) params.offset = offset;
    if (property_slug) params.property_slug = property_slug;
    if (rooms) params.rooms = rooms;
    if (sort_by) params.sort_by = sort_by;

    const response = await api.get(apiEndPoints.rooms, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 14. get properties api
export const getPropertiesApi = async ({
  slug = "",
  adults,
  amenities = "",
  check_in = "",
  check_out = "",
  children,
  country_id,
  lat,
  limit = "",
  lng,
  max_price,
  min_price,
  offset = "",
  pay_at_property = 0,
  property_type_id = "",
  radius_km,
  search = "",
  sort_by = "",
  city_slug = '',
  pets = false,
  rooms,
  ratings,
  rules
}) => {
  try {
    const params = {};
    if (slug) params.slug = slug;
    if (adults) params.adults = adults;
    if (amenities) params.amenities = amenities;
    if (check_in) params.check_in = check_in;
    if (check_out) params.check_out = check_out;
    if (children) params.children = children;
    if (country_id) params.country_id = country_id;
    if (lat) params.lat = lat;
    if (lng) params.lng = lng;
    if (radius_km) params.radius_km = radius_km;
    if (limit) params.limit = limit;
    if (max_price) params.max_price = max_price;
    if (min_price) params.min_price = min_price;
    if (offset) params.offset = offset;
    if (pay_at_property) params.pay_at_property = pay_at_property;
    if (property_type_id) params.property_type_id = property_type_id;
    if (search) params.search = search;
    if (sort_by) params.sort_by = sort_by;
    if (city_slug) params.city_slug = city_slug;
    if (pets) params.pets = true;
    if (rooms) params.rooms = rooms;
    if (ratings) params.ratings = ratings;
    if (rules) params.rules = rules;

    const response = await api.get(apiEndPoints.properties, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 15. get properties api
export const getPropertyDetailsApi = async ({
  slug = "",
}) => {
  try {
    const params = {};
    if (slug) params.slug = slug;

    const response = await api.get(apiEndPoints.propertyDetails, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 16. get properties api
export const getHomepageContentApi = async () => {
  try {

    const response = await api.get(apiEndPoints.homepage);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 17. get properties api
export const getAboutUsContentApi = async () => {
  try {

    const response = await api.get(apiEndPoints.about);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 18. get reviews api
export const getReviewsApi = async ({
  limit = "",
  offset = "",
  property_slug = "",
  room_type_id = "",
  room_type_slug = "",
  sort = ''
}) => {
  try {
    const params = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (property_slug) params.property_slug = property_slug;
    if (room_type_id) params.room_type_id = room_type_id;
    if (room_type_slug) params.room_type_slug = room_type_slug;
    if (sort) params.sort = sort;

    const response = await api.get(apiEndPoints.reviews, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 19. get reviews api
export const bookingQuoteApi = async ({
  property_room_id,
  check_in,
  check_out,
  adults,
  children,
  rooms,
  has_pets,
  coupon_code,
  skip_auto_promo
}) => {
  const response = await api.post(apiEndPoints.bookingQuote, {
    ...(property_room_id !== undefined && { property_room_id }),
    ...(check_in && { check_in }),
    ...(check_out && { check_out }),
    ...(adults !== undefined && { adults }),
    ...(children !== undefined && { children }),
    ...(rooms !== undefined && { rooms }),
    ...(has_pets !== undefined && { has_pets }),
    ...(coupon_code && { coupon_code }),
    ...(skip_auto_promo !== undefined && { skip_auto_promo }),
  });
  return response?.data;
};

// 20. lock booking api
export const lockBookingApi = async ({
  platform = 'web',
  property_room_id,
  check_in,
  check_out,
  rooms,
}) => {
  const response = await api.post(apiEndPoints.lockBooking, {
    ...(platform !== undefined && { platform }),
    ...(property_room_id !== undefined && { property_room_id }),
    ...(check_in && { check_in }),
    ...(check_out && { check_out }),
    ...(rooms !== undefined && { rooms }),
  });
  return response?.data;
};

// 21. confirm booking api
export const confirmBookingApi = async ({
  lock_id,
  payment_method,
  adults,
  children,
  has_pets,
  coupon_code,
  guest_name,
  guest_email,
  guest_phone,
  guest_dial_code,
}) => {
  const response = await api.post(apiEndPoints.confirmBooking, {
    ...(lock_id !== undefined && { lock_id }),
    ...(payment_method && { payment_method }),
    ...(adults !== undefined && { adults }),
    ...(children !== undefined && { children }),
    ...(has_pets !== undefined && { has_pets }),
    ...(coupon_code && { coupon_code }),
    ...(guest_name && { guest_name }),
    ...(guest_email && { guest_email }),
    ...(guest_phone && { guest_phone }),
    ...(guest_dial_code && { guest_dial_code }),
  });
  return response?.data;
};

// 22. get events api
export const getEventsApi = async ({
  country_id,
}) => {
  try {
    const params = {};
    if (country_id) params.country_id = country_id;

    const response = await api.get(apiEndPoints.events, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 23. get event inquiries api
export const eventInquiriesApi = async ({
  event_id,
  name,
  email,
  dial_code,
  phone,
  message,
  property_slug,
}) => {
  const response = await api.post(apiEndPoints.eventInquiries, {
    ...(event_id !== undefined && { event_id }),
    ...(name && { name }),
    ...(email && { email }),
    ...(dial_code && { dial_code }),
    ...(phone && { phone }),
    ...(message && { message }),
    ...(property_slug && { property_slug }),
  });
  return response?.data;
};

// 24. get events api
export const getHelpSupportApi = async ({ limit, offset, search = "", type = "" }) => {
  try {
    const params = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (search) params.search = search;
    if (type) params.type = type;

    const response = await api.get(apiEndPoints.helpSupport, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 25. get blogs api
export const getBlogCategoriesApi = async () => {
  try {

    const response = await api.get(apiEndPoints.blogCategories);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 26. get blogs api
export const getBlogsApi = async ({
  category_id,
  limit,
  offset,
  search,
}) => {
  try {
    const params = {};
    if (category_id) params.category_id = category_id;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (search) params.search = search;

    const response = await api.get(apiEndPoints.blogs, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// 27. confirm booking api
export const confirmBookingWithPaymentGateApi = async ({
  lock_id,
  gateway_type,
  payment_type,
  adults,
  children,
  has_pets,
  coupon_code,
  guest_name,
  guest_email,
  guest_phone,
  guest_dial_code,
}) => {
  const response = await api.post(apiEndPoints.bookingWithPaymentGateway, {
    ...(lock_id !== undefined && { lock_id }),
    ...(gateway_type && { gateway_type }),
    ...(payment_type && { payment_type }),
    ...(adults !== undefined && { adults }),
    ...(children !== undefined && { children }),
    ...(has_pets !== undefined && { has_pets }),
    ...(coupon_code && { coupon_code }),
    ...(guest_name && { guest_name }),
    ...(guest_email && { guest_email }),
    ...(guest_phone && { guest_phone }),
    ...(guest_dial_code && { guest_dial_code }),
  });
  return response?.data;
};

// 28. get translations api
export const getTranslationsApi = async ({
  lang_code,
  platform_type,
}) => {
  try {
    const params = {};
    if (lang_code) params.lang_code = lang_code;
    if (platform_type) params.platform_type = platform_type;

    const response = await api.get(apiEndPoints.translations, { params });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 29. get bookings list api
export const getBookingsListApi = async ({
  limit,
  offset,
  status,
}) => {
  try {
    const params = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (status) params.status = status;

    const response = await api.get(`${apiEndPoints.bookings}`, { params });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 30. get bookings details api
export const getBookingDetailsApi = async ({
  bookingNumber
}) => {
  try {
    const response = await api.get(`${apiEndPoints.bookings}/${bookingNumber}`);

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 31. get booking invoice
export const downloadBookingInvoiceApi = async ({
  bookingNumber
}) => {
  try {
    const response = await api.get(`${apiEndPoints.bookings}/${bookingNumber}/invoice`, {
      responseType: 'blob',
    });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 32. get currencies api
export const getCurrenciesApi = async () => {
  try {
    const response = await api.get(`${apiEndPoints.currencies}`);

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 33. add review api
export const addReviewApi = async ({ booking_number, rating, review, images, existing_image_ids }) => {
  try {
    const reviewData = new FormData();
    reviewData.append("booking_number", booking_number);
    reviewData.append("rating", rating);
    reviewData.append("review", review);
    if (Array.isArray(images) && images.length > 0) {
      images.forEach(image => reviewData.append("images[]", image));
    }
    // if (Array.isArray(existing_image_ids) && existing_image_ids.length > 0) {
    //   existing_image_ids.forEach(id => reviewData.append("existing_image_ids[]", id));
    // }
    const response = await api.post(`${apiEndPoints.review}`, reviewData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 34. edit review api
export const editReviewApi = async ({ booking_number, rating, review, images, existing_image_ids }) => {
  try {
    const reviewData = new FormData();
    reviewData.append("booking_number", booking_number);
    reviewData.append("rating", rating);
    reviewData.append("review", review);
    if (Array.isArray(images) && images.length > 0) {
      images.forEach(image => reviewData.append("images[]", image));
    }
    if (Array.isArray(existing_image_ids) && existing_image_ids.length > 0) {
      existing_image_ids.forEach(id => reviewData.append("existing_image_ids[]", id));
    }
    const response = await api.put(`${apiEndPoints.review}`, reviewData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 35. cancel booking api
export const cancelBookingApi = async ({
  bookingNumber
}) => {
  try {
    const response = await api.post(`${apiEndPoints.bookings}/${bookingNumber}/cancel`);

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 36. manual refund api
export const manualRefundRequestApi = async ({
  bookingNumber,
  account_holder_name,
  bank_name,
  account_number,
  ifsc_swift_code,
  message,
}) => {
  try {
    const response = await api.post(`${apiEndPoints.bookings}/${bookingNumber}/manual-refund`, {
      account_holder_name,
      bank_name,
      account_number,
      ifsc_swift_code,
      message,
    });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }

};

// 37. retry payment api
export const retryPaymentApi = async ({
  bookingNumber,
  // gateway_type,
  // payment_type,
}) => {
  try {
    const response = await api.post(`${apiEndPoints.bookings}/${bookingNumber}/retry-payment`, {
      // gateway_type,
      // payment_type,
    });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 38. contactUs api
export const contactUsApi = async ({
  name,
  email,
  subject,
  message,
}) => {
  try {
    const response = await api.post(apiEndPoints.queries, {
      name,
      email,
      subject,
      message,
    });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 39. get nearby places api
export const getNearbyPlacesApi = async ({ slug }) => {
  try {
    const response = await api.get(`${apiEndPoints.nearbyPlaces}/${slug}/nearby-places`);
    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 41. get notifications api
export const getNotificationsApi = async ({ limit, offset }) => {
  try {
    const params = {};
    if (limit) params.limit = limit;
    if (offset !== undefined) params.offset = offset;

    const response = await api.get(apiEndPoints.getNotifications, { params });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 42. get notification preferences api
export const getNotificationPreferencesApi = async () => {
  try {
    const response = await api.get(apiEndPoints.getNotificationPreferences);

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 43. update notification preference api
export const updateNotificationPreferenceApi = async ({ category, is_enabled }) => {
  try {
    const response = await api.post(apiEndPoints.updateNotificationPreferences, {
      category,
      is_enabled,
    });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// 40. get offers api
export const getOffersApi = async ({ limit, offset, scope, type, property_slug }) => {
  try {
    const params = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    if (scope) params.scope = scope;
    if (type) params.type = type;
    if (property_slug) params.property_slug = property_slug;

    const response = await api.get(apiEndPoints.offers, { params });

    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// change password api
export const changePasswordApi = async ({
  current_password = "",
  password = "",
  password_confirmation = "",
}) => {
  try {
    const response = await api.post(apiEndPoints.changePassword, {
      current_password,
      password,
      password_confirmation,
    });
    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// transactions api
export const getTransactionsApi = async ({ limit = 10, offset = 0 } = {}) => {
  try {
    const response = await api.get(apiEndPoints.transactions, {
      params: { limit, offset },
    });
    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};
// delete account api
export const deleteAccountApi = async ({ password = "", provider = "" } = {}) => {
  try {
    const body = {};
    if (password) body.password = password;
    if (provider) body.provider = provider;

    const response = await api.post(apiEndPoints.deleteAccount, body);
    return response?.data;
  } catch (error) {
    console.error("Error in api call", error);
    throw error;
  }
};

// ===================================== Single phase apis end here =====================================


// ===================================== Multi phase apis start =====================================

// partner regsiter
export const parnterRegisterApi = async ({
  first_name = "",
  last_name = "",
  email = "",
  phone = "",
  dial_code = "",
  password = "",
  password_confirmation = "",
  verification_token = "",
  firebase_id_token = "",
  dob = "",
}) => {
  try {
    const formData = new FormData();
    if (first_name) formData.append("first_name", first_name);
    if (last_name) formData.append("last_name", last_name);
    if (email) formData.append("email", email);
    if (phone) formData.append("phone", phone);
    if (dial_code) formData.append("dial_code", dial_code);
    if (password) formData.append("password", password);
    if (password_confirmation) formData.append("password_confirmation", password_confirmation);
    if (verification_token) formData.append("verification_token", verification_token);
    if (firebase_id_token) formData.append("firebase_id_token", firebase_id_token);
    if (dob) formData.append("dob", dob);

    const response = await api.post(apiEndPoints.partnerRegister, formData);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// get properties dropdown api
export const getSearchSuggestionsApi = async ({
  q = "",
  country_id,
}) => {
  try {
    const params = {};
    if (q) params.q = q;
    if (country_id) params.country_id = country_id;
    const response = await api.get(apiEndPoints.searchSuggestion, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};


// get home page sectoins
export const getHomePageSectionsApi = async ({
  country_id,
  limit = "",
  platform = "",
}) => {
  try {
    const params = {};
    if (country_id) params.country_id = country_id;
    if (limit) params.limit = limit;
    if (platform) params.platform = platform;

    const response = await api.get(apiEndPoints.homePageSections, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// add favorites
export const addFavoritesApi = async ({
  slug = "",
}) => {
  try {
    const formData = new FormData();
    if (slug) formData.append("slug", slug);

    const response = await api.post(`${apiEndPoints.favorites}/${slug}`);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// remove favorites
export const removeFavoritesApi = async ({
  slug = "",
}) => {
  try {
    const formData = new FormData();
    if (slug) formData.append("slug", slug);

    const response = await api.delete(`${apiEndPoints.favorites}/${slug}`, formData);

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// get favorites list
export const getFavoritesListApi = async ({
  limit = 10,
  offset = 0,
}) => {
  try {
    const params = {};
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;

    const response = await api.get(apiEndPoints.favorites, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};

// get property rules
export const getPropertyRulesApi = async ({
  country_id,
  property_type_id,
}) => {
  try {
    const params = {};
    if (country_id) params.country_id = country_id;
    if (property_type_id) params.property_type_id = property_type_id;

    const response = await api.get(apiEndPoints.rules, { params });

    return response?.data; // Assuming response.data contains registration result
  } catch (error) {
    console.error("Error in api call", error);
    throw error; // Re-throw the error to handle it further up the call stack if needed
  }
};