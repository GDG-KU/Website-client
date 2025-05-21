"use client";

import React, { useState, useEffect, ChangeEvent, useCallback } from "react";

import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import styled from "styled-components";
import styles from "./mypage.module.css";

// components
import ProfileImage from "./_components/ProfileImage";
import MyPageButton from "./_components/MyPageButton";
import PointTable from "./_components/PointTable";
import Dropdown from "./_components/Dropdown";
import ProfileModal from "./_components/ProfileModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface HistoryResponseItem {
  id: number;
  point_change: number;
  role: string;
  reason: string;
  date: string;
  is_deleted: boolean;
}

interface ProfileResponse {
  id: number;
  nickname: string;
  role: string;
  email: string;
  department: string;
  student_number: string;
  position_names: string[];
  profile_image: string;
  join_date: string; // "YYYY-MM-DD"
}

interface PointHistoryItem {
  date: string;
  change: number;
  total: number;
  reason: string;
}

interface UserData {
  id: number | null;
  name: string;
  major: string;
  role: string;
  joinDate: string;
  isCore: boolean;
}

const MOCK_DATA = {
  id: 1,
  name: "박신디",
  major: "인공지능학과 25학번",
  role: "FE / Member",
  joinDate: "2025-03-28",
  isCore: true,
};

const DROPDOWN_MOCK_DATA = [
  {
    id: 1,
    role: "AI/ Core",
  },
  {
    id: 2,
    role: "DevRel / Member",
  },
];

export default function MyPage() {
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState<UserData>({
    id: null,
    name: "",
    major: "",
    role: "",
    joinDate: "",
    isCore: false,
  });
  const [profileImageUrl, setProfileImageUrl] = useState<string>("/profile.svg");
  const [totalPoint, setTotalPoint] = useState<number>(0);
  const [pointHistory, setPointHistory] = useState<PointHistoryItem[]>([]);
  const [profilePositions, setProfilePositions] = useState<string[]>([]);

  // Handle Edit Profile Modal
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    name: "",
    dept: "",
    studentNum: "",
    positionNames: "",
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${year}. ${month}. ${day}`;
  };

  const fetchProfileImage = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile/image`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("프로필 이미지 URL 조회 실패");
      const data = await res.json();
      const imageUrl = data.url || "/profile.svg";
      setProfileImageUrl(imageUrl);
    } catch (error) {
      console.error("프로필 이미지 URL 조회 실패:", error);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile`, {
        method: "GET",
      });
      if (!res.ok) throw new Error("프로필 조회 실패");
      const data: ProfileResponse = await res.json();
      setProfilePositions(data.position_names);

      const positionsJoined = data.position_names.join(" / ");
      const combinedRole = positionsJoined ? `${data.role} / ${positionsJoined}` : data.role;

      setUserData({
        ...userData,
        id: data.id,
        name: data.nickname,
        major: `${data.department} ${data.student_number}학번`,
        role: combinedRole,
        joinDate: formatDate(data.join_date),
        isCore: combinedRole.includes("Organizer") || combinedRole.includes("Core") || combinedRole.includes("Admin"),
      });

      fetchProfileImage();
    } catch (error) {
      console.error("프로필 조회 실패:", error);
    }
  }, [fetchProfileImage]);

  const fetchPointHistory = useCallback(async () => {
    if (userData?.id === null) return;
    try {
      const queryRole = userData?.role.includes(" / ") ? userData?.role.split(" / ")[0].trim() : userData?.role;
      const res = await fetchWithAuth(
        `${API_BASE_URL}/point/history/${userData?.id}?role=${encodeURIComponent(queryRole)}`,
        {
          method: "GET",
        },
      );
      if (!res.ok) throw new Error("포인트 히스토리 조회 실패");
      const data: HistoryResponseItem[] = await res.json();

      const sortedData = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      let runningTotal = 0;
      const mappedAsc = sortedData.map((item) => {
        runningTotal += item.point_change;
        return {
          date: formatDate(item.date),
          change: item.point_change,
          total: runningTotal,
          reason: item.reason,
        };
      });

      setTotalPoint(runningTotal);
      setPointHistory([...mappedAsc].reverse());
    } catch (error) {
      console.error("포인트 히스토리 조회 실패:", error);
    }
  }, [userData?.id, userData?.role]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (userData?.id !== null) {
      fetchPointHistory();
    }
  }, [userData?.id, fetchPointHistory]);

  // --------- MOCK DATA testing (unable to log in atm)
  // useEffect(() => {
  //   setUserData({ ...MOCK_DATA });
  // }, []);

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const localUrl = URL.createObjectURL(file);
    setProfileImageUrl(localUrl);

    try {
      const signedUrlRes = await fetchWithAuth(`${API_BASE_URL}/mypage/signedurl`, {
        method: "GET",
      });
      if (!signedUrlRes.ok) throw new Error("서명된 URL 생성 실패");
      const signedUrlData = await signedUrlRes.json();
      const uploadUrl = signedUrlData.signedurl;

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("파일 업로드 실패");

      const imageUrl = uploadUrl.split("?")[0];

      const patchRes = await fetchWithAuth(`${API_BASE_URL}/mypage/profile/image`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      });
      if (!patchRes.ok) throw new Error("프로필 이미지 업로드 최종 갱신 실패");

      const patchData = await patchRes.json();
      setProfileImageUrl(patchData.url);
    } catch (err) {
      console.error("프로필 이미지 업로드 에러:", err);
    }
  };

  const handleDeleteProfileImage = async () => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile/image`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("프로필 이미지 삭제 실패");
      setProfileImageUrl("/profile.svg");
      console.log("프로필 이미지 삭제 성공");
    } catch (error) {
      console.error("프로필 이미지 삭제 에러:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      dispatch(logout());
      window.location.href = "/";
    }
  };

  const openModal = () => {
    const majorArr = userData?.major.split(" ");
    setModalData({
      ...modalData,
      name: userData?.name,
      dept: majorArr[0] || "",
      studentNum: majorArr[1] ? majorArr[1].replace("학번", "") : "",
      positionNames: profilePositions.join(", "),
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSaveProfile = async () => {
    const body = {
      nickname: modalData.name,
      department: modalData.dept,
      student_number: modalData.studentNum,
      position_names: modalData.positionNames
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v !== ""),
    };

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/mypage/profile`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        console.error("프로필 정보 수정 실패");
        return;
      }
      console.log("프로필 정보 수정 성공");
      setProfilePositions(body.position_names);

      setUserData({
        ...userData,
        name: modalData.name,
        major: `${modalData.dept} ${modalData.studentNum}학번`,
        role: body.position_names.length > 0 ? body.position_names.join(" / ") : "",
      });
      setShowModal(false);
    } catch (err) {
      console.error("프로필 정보 수정 에러:", err);
    }
  };

  const handleModalChange = (value: string, name: string) => {
    setModalData({
      ...modalData,
      [name]: value,
    });
  };

  return (
    <StyledPageContainer>
      <StyledSection style={{ justifyContent: "center", gap: "2rem" }}>
        <ProfileImage profileImageUrl={profileImageUrl} onChange={handleProfileImageChange} />
        <h2>{userData?.name}</h2>
        <GroupedSection>
          <p>{userData?.major}</p>
          <p>{userData?.role}</p>
          <p>{userData.joinDate && `가입일:  ${userData?.joinDate}`}</p>
        </GroupedSection>
        <GroupedSection>
          <MyPageButton buttonText="정보 수정" onClick={openModal} />
          <MyPageButton buttonText="관리자 모드" href="/admin" isBlue />
          <MyPageButton buttonText="멤버 탈퇴" onClick={handleLogout} />
        </GroupedSection>
      </StyledSection>
      <StyledSection style={{ gap: "0.5rem" }}>
        <StatusSection>
          <h3>My Status</h3>
          {/* -----Note: Dropdown is set to read-only for now */}
          <Dropdown value="" placeholder={userData?.role} data={DROPDOWN_MOCK_DATA} field={""} disabled={true} />
        </StatusSection>
        <PointSection>
          <span>{totalPoint}P</span>
        </PointSection>
        <PointTable pointHistory={pointHistory} />
      </StyledSection>

      {showModal && (
        <ProfileModal
          profileData={modalData}
          onChange={handleModalChange}
          onSaveProfile={handleSaveProfile}
          onDeleteImage={handleDeleteProfileImage}
          onCloseModal={closeModal}
        />
      )}
    </StyledPageContainer>
  );
}

const StyledPageContainer = styled.div`
  display: flex;

  width: 100vw;
  height: 100vh;

  /* margin-left: 240px; */
  gap: 2rem;
`;

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 2rem;

  text-align: center;

  h2 {
    font-weight: bold;
    font-size: 25px;
    margin-bottom: 1em;
  }

  p {
    font-size: 14px;
    font-weight: 200;
  }
`;

const PointSection = styled.div`
  background-color: #fff;
  border-radius: 16px;
  width: 100%;
  min-height: 150px;

  display: flex;
  align-items: center;
  justify-content: center;

  span {
    font-weight: bold;
    font-size: 40px;
  }
`;

const StatusSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding-bottom: 10px;

  h3 {
    font-size: 15px;
  }
`;

const GroupedSection = styled.div`
  display: flex;
  flex-direction: column;

  gap: 0.5rem;
`;
