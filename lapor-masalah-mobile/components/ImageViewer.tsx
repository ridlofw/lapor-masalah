import React, { useState, useRef } from "react";
import {
    View,
    Text,
    Image,
    Modal,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
    Animated,
    PanResponder,
} from "react-native";
import { COLORS } from "@/constants/config";

const { width, height } = Dimensions.get("window");

interface ImageViewerProps {
    images: string[];
    visible: boolean;
    initialIndex?: number;
    onClose: () => void;
}

export function ImageViewer({ images, visible, initialIndex = 0, onClose }: ImageViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isZoomed, setIsZoomed] = useState(false);

    // Scale animation
    const scale = useRef(new Animated.Value(1)).current;
    const lastScale = useRef(1);

    // Position for panning when zoomed
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const lastTranslateX = useRef(0);
    const lastTranslateY = useRef(0);

    const handleScroll = (event: any) => {
        if (!isZoomed) {
            const offsetX = event.nativeEvent.contentOffset.x;
            const index = Math.round(offsetX / width);
            setCurrentIndex(index);
        }
    };

    const handleDoubleTap = () => {
        if (isZoomed) {
            // Zoom out
            Animated.parallel([
                Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
                Animated.spring(translateX, { toValue: 0, useNativeDriver: true }),
                Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
            ]).start();
            lastScale.current = 1;
            lastTranslateX.current = 0;
            lastTranslateY.current = 0;
            setIsZoomed(false);
        } else {
            // Zoom in
            Animated.spring(scale, { toValue: 2.5, useNativeDriver: true }).start();
            lastScale.current = 2.5;
            setIsZoomed(true);
        }
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => isZoomed,
            onMoveShouldSetPanResponder: () => isZoomed,
            onPanResponderGrant: () => {
                translateX.extractOffset();
                translateY.extractOffset();
            },
            onPanResponderMove: (_, gestureState) => {
                if (isZoomed) {
                    translateX.setValue(gestureState.dx);
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: () => {
                translateX.flattenOffset();
                translateY.flattenOffset();
            },
        })
    ).current;

    const handleClose = () => {
        // Reset zoom state
        scale.setValue(1);
        translateX.setValue(0);
        translateY.setValue(0);
        lastScale.current = 1;
        lastTranslateX.current = 0;
        lastTranslateY.current = 0;
        setIsZoomed(false);
        onClose();
    };

    // Track tap timing for double tap detection
    const lastTap = useRef(0);
    const handleTap = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
            handleDoubleTap();
        }
        lastTap.current = now;
    };

    if (images.length === 0) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.counter}>
                        {currentIndex + 1} / {images.length}
                    </Text>
                    <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Images */}
                <ScrollView
                    horizontal
                    pagingEnabled
                    scrollEnabled={!isZoomed}
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={handleScroll}
                    contentOffset={{ x: initialIndex * width, y: 0 }}
                >
                    {images.map((uri, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={1}
                            onPress={handleTap}
                            style={styles.imageContainer}
                            {...(index === currentIndex ? panResponder.panHandlers : {})}
                        >
                            <Animated.Image
                                source={{ uri }}
                                style={[
                                    styles.image,
                                    index === currentIndex && {
                                        transform: [
                                            { scale },
                                            { translateX },
                                            { translateY },
                                        ],
                                    },
                                ]}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Zoom hint */}
                <View style={styles.zoomHint}>
                    <Text style={styles.zoomHintText}>
                        {isZoomed ? "Double tap untuk zoom out" : "Double tap untuk zoom in"}
                    </Text>
                </View>

                {/* Dots indicator */}
                {images.length > 1 && (
                    <View style={styles.dotsContainer}>
                        {images.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentIndex === index && styles.dotActive,
                                ]}
                            />
                        ))}
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 10,
        zIndex: 10,
    },
    counter: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
    },
    closeText: {
        color: COLORS.white,
        fontSize: 20,
        fontWeight: "bold",
    },
    imageContainer: {
        width: width,
        height: height - 200,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        width: width - 20,
        height: "100%",
    },
    zoomHint: {
        alignItems: "center",
        paddingVertical: 10,
    },
    zoomHintText: {
        color: "rgba(255, 255, 255, 0.6)",
        fontSize: 12,
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: COLORS.white,
    },
});
