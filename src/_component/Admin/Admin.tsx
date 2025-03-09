import { useMemberData, useAcceptData} from '@/api/userAdmin';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { useNavigate } from '@tanstack/react-router';
import { UserModal } from './UserModal';

export default function Admin() {
    const { data, isLoading, error } = useMemberData();
    const [filter, setFilter] = useState<'all' | 'pending'>('all');
    const mutation = useAcceptData();
    const navigate = useNavigate();
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const onSubmitHandler = async (id:string) => {
      try {
        await mutation.mutateAsync(id);
        toast({
          title: '승인 완료',
          description: '승인 완료',
        });
      } catch (err) {
        console.log(err)
      }
    };

    const getStateVariant = (state: string) => {
        return state === 'Active' ? 'default' : 'destructive';
    };

    const getFilteredData = () => {
        if (!data || !data.memberResultDTOListManage) return [];
        
        const filteredData = filter === 'all'
            ? data.memberResultDTOListManage
            : data.memberResultDTOListManage.filter(user => user.state !== 'Active');
        
        return filteredData.sort((a, b) => {
            if (a.state === 'Active' && b.state !== 'Active') return -1;
            if (a.state !== 'Active' && b.state === 'Active') return 1;
            
            return a.username.localeCompare(b.username);
        });
    };

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러가 발생했습니다.</div>;

    
    return (
        <div>
            <div className="mb-4 space-x-2 flex justify-center pt-4">
                <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilter('all')}
                >
                    모두 보기
                </Button>
                <Button
                    variant={filter === 'pending' ? 'default' : 'outline'}
                    onClick={() => setFilter('pending')}
                >
                    승인 대기중
                </Button>
            </div>
            <div className='flex justify-center'>
                <div className='w-full max-w-4xl overflow-x-auto'>
                    <Table>
                        <TableCaption>사용자 관리 목록</TableCaption>
                        <TableHeader>
                        <TableRow>
                            <TableHead>이름</TableHead>
                            <TableHead>이메일</TableHead>
                            <TableHead>상태</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && getFilteredData().map((user) => (
                            <TableRow 
                                key={user.userId} 
                                className="w-4/5 hover:bg-gray-100 overflow-x-scroll cursor-pointer"
                                onClick={() => setSelectedUserId(user.userId)}
                            >
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell className="truncate max-w-[150px]">{user.email}</TableCell>
                                <TableCell>
                                    <Badge 
                                        onClick={user.state !== 'Active' ? () => onSubmitHandler(user.userId) : undefined}
                                        variant={getStateVariant(user.state)}
                                        className={user.state !== 'Active' ? 'cursor-pointer hover:opacity-80' : ''}
                                    >
                                        {user.state === 'Active' ? '승인됨' : '대기'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            </div>
            <div className='p-4 flex justify-center'>
                <Button variant='outline' onClick={() => navigate({to: '/adminnotice'})}>공지사항 관리</Button>
            </div>
            {selectedUserId && <UserModal selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} />}
        </div>
    );
}
