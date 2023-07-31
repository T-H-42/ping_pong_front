import React, { useEffect, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import { friendsState } from '../../api/atoms';

const FriendList = () => {
    console.log('프렌드리스트 컴포넌트');
    const friends = useRecoilValue<any>(friendsState);

    return (
        <div style={{ border: '1px solid #000', padding: '10px' }}>
            <h2>친구 목록</h2>
            <ul style={{ textAlign: 'left' }}>
                {friends.map((friend: any) => (
                    <div key={friend.f_id}>
                        <li>
                            {friend.status ? (
                                <button
                                    style={{
                                        width: '15px',
                                        height: '15px',
                                        borderRadius: '50%',
                                        backgroundColor: 'green',
                                    }}
                                ></button>
                            ) : (
                                <button
                                    style={{
                                        width: '15px',
                                        height: '15px',
                                        borderRadius: '50%',
                                        backgroundColor: 'red',
                                    }}
                                ></button>
                            )}{' '}
                            {friend.username}
                        </li>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default FriendList;
