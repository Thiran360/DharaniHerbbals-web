/**
 * deliveryChecker.js
 * Verified delivery check using the official Postal Pincode API
 * and existing verified delivery rules from Dharani Herbals shipping policy.
 */

const PINCODE_CACHE = new Map();

/**
 * Validate format: 6 numeric digits, starting with 1-9
 */
export function isValidIndianPin(pin) {
  return /^[1-9][0-9]{5}$/.test(String(pin || '').trim());
}

/**
 * Determine estimated business days based on Indian Postal Zone (first digit)
 * Reference: Terms & Conditions and Shipping Policy
 */
export function getTimelineByZone(firstDigit) {
  switch (firstDigit) {
    case '6':
      return '2–3 business days'; // Tamil Nadu, Kerala, Pondicherry (Local Hub)
    case '5':
      return '3–4 business days'; // Karnataka, Andhra Pradesh, Telangana
    case '1':
    case '2':
    case '3':
    case '4':
    case '7':
    case '8':
      return '5–7 business days'; // North, West, East & Central India
    default:
      return '3–7 business days';
  }
}

/**
 * Check delivery availability for a 6-digit Indian PIN code
 */
export async function checkDeliveryPincode(pinCode) {
  const pin = String(pinCode || '').trim();

  if (!isValidIndianPin(pin)) {
    return {
      success: false,
      deliverable: false,
      message: 'Please enter a valid 6-digit Indian PIN code (e.g. 641001).'
    };
  }

  // Check in-memory cache
  if (PINCODE_CACHE.has(pin)) {
    return PINCODE_CACHE.get(pin);
  }

  const firstDigit = pin.charAt(0);
  const fallbackTimeline = getTimelineByZone(firstDigit);

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`Postal API returned HTTP ${response.status}`);
    }

    const data = await response.json();
    const resultItem = Array.isArray(data) ? data[0] : null;

    if (resultItem && resultItem.Status === 'Success' && Array.isArray(resultItem.PostOffice) && resultItem.PostOffice.length > 0) {
      const po = resultItem.PostOffice[0];
      const district = po.District || '';
      const state = po.State || '';
      const location = [district, state].filter(Boolean).join(', ');

      const result = {
        success: true,
        deliverable: true,
        pin,
        location,
        timeline: fallbackTimeline,
        message: `Deliverable to ${location || pin} within ${fallbackTimeline}. Standard shipping with live tracking.`
      };

      PINCODE_CACHE.set(pin, result);
      return result;
    } else {
      // The postal API specifically checked and reported no post offices for this code
      return {
        success: false,
        deliverable: false,
        message: `PIN code ${pin} could not be verified. Please verify your postal code.`
      };
    }
  } catch (err) {
    // If external API has network latency or is offline, use the verified postal zone rule
    const fallbackResult = {
      success: true,
      deliverable: true,
      pin,
      location: null,
      timeline: fallbackTimeline,
      message: `Delivery available in ${fallbackTimeline} across serviceable courier routes.`
    };
    return fallbackResult;
  }
}
