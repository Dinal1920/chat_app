
const AuthImagePattern = ({ title, subtitle }) => {
   return (
     <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">

         <div className="relative h-48 mb-8 left-1/4 ">
           {[...Array(11)].map((_, i) => ( //12 circles bnaenge randomly position ke sath
             <div
               key={i}
               className="absolute w-16 h-16 rounded-full bg-primary/30 animate-bounce" //animate-bounce se circles ko thoda movement milega
               style={{
                top: `${Math.random() * 120}px`, //random top position between 0 and 120px
              left: `${Math.random() * 200}px`, //random left position between 0 and 200px
              }}
           />
          ))}
        </div>

       <h2 className="text-2xl font-bold mb-4">{title}</h2> 
         <p className="text-base-content/60">{subtitle}</p>

      </div>
    </div>
  );
 };



export default AuthImagePattern;


// import { useState } from "react";

// const AuthImagePattern = ({ title, subtitle }) => {

//   const [bubbles] = useState(
//     [...Array(12)].map(() => ({
//       top: Math.random() * 120,
//       left: Math.random() * 200,
//     }))
//   );

//   return (
//     <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
//       <div className="max-w-md text-center">

//         <div className="relative h-48 mb-8 left-1/4">
//           {bubbles.map((bubble, i) => (
//             <div
//               key={i}
//               className="absolute w-16 h-16 rounded-full bg-primary/30 animate-bounce"
//               style={{
//                 top: `${bubble.top}px`,
//                 left: `${bubble.left}px`,
//               }}
//             />
//           ))}
//         </div>

//         <h2 className="text-2xl font-bold mb-4">{title}</h2>
//         <p className="text-base-content/60">{subtitle}</p>

//       </div>
//     </div>
//   );
// };

// export default AuthImagePattern;