import dynamic from 'next/dynamic';
import React, { useEffect, useRef } from 'react';
// import { Datepicker } from 'vanillajs-datepicker'; // Ensure you have the correct import path
// const Datepicker = dynamic(() => import('vanillajs-datepicker'), {
//     ssr: false, // This ensures that the component is only loaded on the client side
//   });
const Datepicker = dynamic(() => import('vanillajs-datepicker') as Promise<{ default: any }>, {
    ssr: false,
}) as any;
import 'vanillajs-datepicker/css/datepicker-bulma.css'

const InlineDatepicker = () => {
    const datepickerRef = useRef(null);

    useEffect(() => {
        if (datepickerRef.current) {
            const datepicker = new Datepicker(datepickerRef.current, {
                buttonClass: 'btn'
            });

            // Cleanup function to destroy the datepicker instance
            return () => {
                datepicker.destroy();
            };
        }
    }, []);

    return (
        <div id="pc-datepicker-6" ref={datepickerRef}></div>
    );
};

export default InlineDatepicker;
