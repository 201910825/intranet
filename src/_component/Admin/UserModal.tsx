import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserData } from "@/api/userAdmin";

export const UserModal = ({selectedUserId, setSelectedUserId}: {selectedUserId: string | null, setSelectedUserId: (userId: string | null) => void}) => {
    const { data: userData } = useUserData(selectedUserId ?? '');
    if(!selectedUserId) return null;
    console.log(userData)
    return (
        <Dialog open={!!selectedUserId} onOpenChange={() => setSelectedUserId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>사용자 상세 정보</DialogTitle>
                    </DialogHeader>
                    {userData ? (
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold">프로필 이미지</h4>
                                <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-200">
                                    <img 
                                        className="w-full h-full object-cover"
                                        src={userData.profileImage || '/default.jpg'} 
                                        alt="없음" 
                                    />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold">이름</h4>
                                <p>{userData.username}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">이메일</h4>
                                <p>{userData.email}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">전화번호</h4>
                                <p>{userData.phone}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold">직책</h4>
                                <p>{userData.position}</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p>사용자 정보를 불러오는 중입니다.</p>
                        </div>
                    )}
            </DialogContent>
        </Dialog>
    );
}