import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

const MenuContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #07287c;
`;

const MenuItems = styled.div`
  display: flex;
  gap: 1rem;
`;

const MenuItem = styled.a`
  color: #07287c;
  text-decoration: none;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

export default function Menu() {
  return (
    <MenuContainer>
      <Logo>슈팅어때</Logo>
      <MenuItems>
        <Link href="/booking" passHref>
          <MenuItem>예약하기</MenuItem>
        </Link>
        <Link href="/user/signin" passHref>
          <MenuItem>로그인</MenuItem>
        </Link>
      </MenuItems>
    </MenuContainer>
  );
} 