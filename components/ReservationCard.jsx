import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const Info = styled.div`
  margin-top: 12px;
  text-align: center;
`;

const ReservationCard = ({ name, date, time, imageUrl }) => {
  return (
    <Card>
      <Image src={imageUrl} alt="Reservation" />
      <Info>
        <h3>{name}</h3>
        <p>{date}</p>
        <p>{time}</p>
      </Info>
    </Card>
  );
};

export default ReservationCard; 