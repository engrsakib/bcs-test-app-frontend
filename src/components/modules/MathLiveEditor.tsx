// components/modules/MathLiveEditor.tsx

'use client';

import React from 'react';
import { MathfieldComponent } from 'react-mathlive'; 
import 'mathlive/dist/mathlive-static.css';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function MathLiveEditor({ value, onChange }: Props) {
  return (
    // --- এইখানে লিখবেন ---
    // @ts-ignore 
    <MathfieldComponent
      latex={value}
      onChange={onChange}
      mathfieldConfig={{
        virtualKeyboardMode: 'onfocus',
        smartFence: true,
      }}
      // style={{
      //   width: '100%',
      //   fontSize: '24px',
      //   padding: '10px',
      //   border: '1px solid #4a5568',
      //   borderRadius: '8px',
      //   backgroundColor: '#FFF',
      //   color: '#000',
      // }}
    />
  );
}