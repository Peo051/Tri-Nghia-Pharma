import { getUserInfo, getAccessToken, getPhoneNumber } from "zmp-sdk";

export interface ZaloUserProfile {
  id?: string;
  name?: string;
  avatar?: string;
  phoneNumber?: string;
  followedOA?: boolean;
  timestamp?: number;
}

/**
 * Lấy thông tin người dùng từ Zalo SDK
 */
export async function fetchZaloUserInfo(): Promise<ZaloUserProfile> {
  try {
    const res = await getUserInfo({
      avatarType: "normal",
    });

    return {
      id: res.userInfo.id,
      name: res.userInfo.name,
      avatar: res.userInfo.avatar,
      followedOA: res.userInfo.followedOA,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.warn("Chưa lấy được thông tin người dùng Zalo:", error);
    return {
      timestamp: Date.now(),
    };
  }
}

/**
 * Đồng bộ thông tin người dùng lên hệ thống backend / server
 */
export async function syncUserToSystem(profile: ZaloUserProfile): Promise<boolean> {
  // Lưu profile vào localStorage để duy trì trạng thái phiên làm việc
  try {
    if (profile.name || profile.id) {
      localStorage.setItem("opodis_user_profile", JSON.stringify(profile));
    }
  } catch (e) {
    // Ignore storage errors
  }

  // Nếu có endpoint API trong cấu hình, gửi POST request lên server
  const apiUrl = window.APP_CONFIG?.template?.apiUrl;
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/api/users/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });
      return response.ok;
    } catch (err) {
      console.warn("Không thể gửi thông tin lên server backend:", err);
      return false;
    }
  }

  return true;
}
