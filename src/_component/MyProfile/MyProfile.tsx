import { useProfile } from '../../api/profile'
import { useState } from 'react';
import EditProfileModal from './EditProfileModal';
import MySchedule from './MySchedule';
const MyProfile = () => {
    const { data, isLoading, error } = useProfile()
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    return (<>
       {isLoading ? (
           <div className="flex justify-center items-center p-8">
               <h1 className="text-2xl text-gray-600">Loading...</h1>
           </div>
       ) : (
           <div className="max-w-2xl mx-auto my-8 p-8 bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">내 프로필</h1>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        프로필 수정
                    </button>
                </div>
                <div className="space-y-4">
                    {data?.profileImageUrl && (
                        <div className="flex justify-center">
                            <img 
                                src={data.profileImageUrl} 
                                alt="프로필 이미지"
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                            />
                        </div>
                    )}
                    <div className="space-y-3">
                        <p className="py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-700 inline-block w-32">이름:</span>
                            <span className="text-gray-600">{data?.username}</span>
                        </p>
                        <p className="py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-700 inline-block w-32">이메일:</span>
                            <span className="text-gray-600">{data?.email}</span>
                        </p>
                        <p className="py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-700 inline-block w-32">휴대폰 번호:</span>
                            <span className="text-gray-600">{data?.phone}</span>
                        </p>
                        <p className="py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-700 inline-block w-32">직책:</span>
                            <span className="text-gray-600">{data?.position}</span>
                        </p>
                        <p className="py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-700 inline-block w-32">성별:</span>
                            <span className="text-gray-600">{data?.gender === 'MALE' ? '남성' : '여성'}</span>
                        </p>
                        <p className="py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-700 inline-block w-32">역할:</span>
                            <span className="text-gray-600">{data?.role}</span>
                        </p>
                        <p className="py-2 border-b border-gray-100">
                            <span className="font-medium text-gray-700 inline-block w-32">상태:</span>
                            <span className="text-gray-600">{data?.state}</span>
                        </p>
                    </div>
                </div>
                <MySchedule />
            </div>
        )}
        {error && (
            <div className="flex justify-center items-center p-8">
                <h1 className="text-2xl text-red-600">Error</h1>
            </div>
        )}

        <EditProfileModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            currentData={data || {}}
        />
    </>)
}

export default MyProfile;