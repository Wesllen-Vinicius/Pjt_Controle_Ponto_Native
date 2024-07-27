import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Animated } from 'react-native';

interface AnimationContextProps {
    themeAnimation: Animated.Value;
    transitionDuration: number;
}

const AnimationContext = createContext<AnimationContextProps | undefined>(
    undefined
);

export const AnimationProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [themeAnimation] = useState(new Animated.Value(0));
    const transitionDuration = 100;

    return (
        <AnimationContext.Provider
            value={{ themeAnimation, transitionDuration }}
        >
            {children}
        </AnimationContext.Provider>
    );
};

export const useAnimation = () => {
    const context = useContext(AnimationContext);
    if (context === undefined) {
        throw new Error(
            'useAnimation must be used within an AnimationProvider'
        );
    }
    return context;
};
