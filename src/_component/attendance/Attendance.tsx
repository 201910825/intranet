import { useEffect, useState } from 'react';
import { MonitorSmartphone } from 'lucide-react';
import { useAttendanceCheck, useOffCheck } from '@/api/Attendance';
import { useCommute } from '@/api/Commute';
import { useNavigate } from '@tanstack/react-router';
import { useProfile } from '@/api/profile';
interface Location {
  latitude: number;
  longitude: number;
}

export default function Attendance() {
  const date = new Date();
  const today = `${date.getFullYear()}-${`${date.getMonth()+1}`.padStart(2, '0')}-${`${date.getDate()}`.padStart(2, '0')}`; 
  const { data } = useCommute(today);  
  const { data: profileData } = useProfile()
  const [error, setError] = useState<string>('');
  const [location, setLocation] = useState<Location|null>(null);
  const [isAttendance, setIsAttendance] = useState(false);
  const navigate = useNavigate()
  // 회사 위치 좌표 (예시)
  const COMPANY_LOCATION: Location = {
    latitude: 37.556,  // 회사 위도
    longitude: 126.937 // 회사 경도
  };
  const checkAttendance = useAttendanceCheck();
  const checkOff = useOffCheck();
  // 허용 반경 (미터 단위)
  const ALLOWED_RADIUS = 150; 

  // 현재 로그인한 사용자 ID (예시 - 실제 사용하는 방식으로 대체 필요)
  const currentUserId = profileData?.memberId
  console.log(profileData)
  // 두 지점 간의 거리 계산 (Haversine 공식)
  const calculateDistance = (loc1: Location, loc2: Location): number => {
    const R = 6371e3; // 지구의 반지름 (미터)
    const φ1 = (loc1.latitude * Math.PI) / 180;
    const φ2 = (loc2.latitude * Math.PI) / 180;
    const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
    const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 미터 단위 거리
  };
  console.log(isAttendance)

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  };
  const handleAttendanceCheck = (date: string) => {
    if (!navigator.geolocation) {
      setError('이 브라우저에서는 위치 정보를 지원하지 않습니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        setLocation(currentLocation);
        const distance = calculateDistance(COMPANY_LOCATION, currentLocation);

        if (distance <= ALLOWED_RADIUS) {
          alert("출근 체크 성공");
          checkAttendance.mutateAsync({attendanceDay: date, attendanceType: 'ATTENDANCE'});
          setIsAttendance(true);
          navigate({ to: '/' });
        } else {
          setError(`회사 위치에서 벗어났습니다. (현재 거리: ${Math.round(distance)}m)`);
        }
      },
      (error) => {
        console.error('위치 정보 오류:', error); // 디버깅을 위한 로그 추가
        switch (error.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            setError('브라우저의 위치 정보 접근 권한을 허용해주세요.');
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            setError('위치 정보를 가져올 수 없습니다. GPS 신호를 확인해주세요.');
            break;
          case GeolocationPositionError.TIMEOUT:
            setError('위치 정보 요청 시간이 초과되었습니다. 다시 시도해주세요.');
            break;
          default:
            setError('위치 정보 조회 중 오류가 발생했습니다.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,  // 타임아웃 시간을 10초로 증가
        maximumAge: 0
      }
    );
  };
  const handleOffCheck = (date: string) => {
    checkOff.mutateAsync(date);
    console.log(checkOff.mutateAsync(date))
    navigate({
      to: '/',
    })
  }

  useEffect(() => {
    if (data?.attendanceDayResultDTOList) {
      const userAttendance = data.attendanceDayResultDTOList.find(
        attendance => attendance.userId === currentUserId && !attendance.offTime
      );
      console.log(userAttendance)
      setIsAttendance(!!userAttendance);
    }
  }, [data]);
  return (
    <div className="w-full flex flex-col items-center justify-center h-4/5">
      {!isAttendance ? <div className='rounded-full bg-black flex flex-col items-center justify-center cursor-pointer focus-visible:outline-none hover:opacity-70 active:opacity-100 disabled:pointer-events-none disabled:opacity-5 p-8'
      onClick={() => handleAttendanceCheck(getCurrentDateTime())}>
        <MonitorSmartphone 
          size={200} 
          color="white" 
          strokeWidth={1.5}
        />
        <h1 className='text-white'>출근 체크</h1>
      </div> : <div className='rounded-full bg-black flex flex-col items-center justify-center cursor-pointer focus-visible:outline-none hover:opacity-70 active:opacity-100 disabled:pointer-events-none disabled:opacity-5 p-8'
      onClick={() => handleOffCheck(getCurrentDateTime())}>
        <MonitorSmartphone 
          size={200} 
          color="white" 
          strokeWidth={1.5}
        />
        <h1 className='text-white'>퇴근 체크</h1>
      </div>}
      {error && <p className="error-message">{error}</p>}
      {location && location.latitude}
      <br />
      {location && location.longitude}
    </div>
  );
}