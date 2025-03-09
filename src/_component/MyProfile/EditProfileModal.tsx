import { useState, useRef } from 'react';
import { useUpdateProfile, useUpdateProfileImage, useDeleteUser } from '../../api/profile';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentData: {
        username?: string;
        email?: string;
        phone?: string;
    };
}

const EditProfileModal = ({ isOpen, onClose, currentData }: EditProfileModalProps) => {
    const [formData, setFormData] = useState({
        username: currentData.username || '',
        email: currentData.email || '',
        phone: currentData.phone || '',
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
    const { mutate: updateImage, isPending: isUploading } = useUpdateProfileImage();
    const { mutate: deleteUser } = useDeleteUser();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            updateImage(file, {
                onSuccess: () => {
                    // 성공 메시지 표시 가능
                }
            });
        }
    };

    const handleDeleteProfile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const defaultImage = new File(
            [''], 
            'default.jpg', 
            { type: 'image/jpg' }
        );
        updateImage(defaultImage, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    const handleDeleteUser = () => {
        const result = confirm('정말 회원탈퇴를 진행하시겠습니까?');
        if (result) {
            deleteUser();
            toast({
                title: '회원탈퇴 완료',
                description: '회원탈퇴 완료',
            });
        }
        else {
            toast({
                title: '취소됨',
                description: '취소됨',
            });
        }
    };
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">프로필 수정</h2>
                
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">프로필 이미지</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                        disabled={isUploading}
                    >
                        {isUploading ? '업로드 중...' : '이미지 선택'}
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteProfile}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50"
                    >
                        프로필 삭제
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">이름</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">이메일</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-2">휴대폰 번호</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                            className="w-full p-2 border border-gray-300 rounded bg-white"
                        />
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isUpdating || isUploading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {isUpdating || isUploading ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </form> 
                
                <div className='flex justify-center'>
                <Button variant='outline' onClick={handleDeleteUser}>회원탈퇴</Button>
                </div>
            </div>
           
        </div>
    );
};

export default EditProfileModal;