import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	View,
	StyleSheet,
	Image,
	Text,
	TextInput,
	TouchableOpacity
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import {
	requestPermissionsAsync,
	getCurrentPositionAsync
} from "expo-location";
import { MaterialIcons } from "@expo/vector-icons";

import api from "../services/api";
import { connect, disconnect } from "../services/socket";

function Main({ navigation }) {
	const [devs, setDevs] = useState([]);
	const [currentRegion, setCurrentRegion] = useState(null);
	const [techs, setTechs] = useState("");

	useEffect(() => {
		async function loadInitialPosition() {
			const { granted } = await requestPermissionsAsync();
			if (granted) {
				const { coords } = await getCurrentPositionAsync({
					enableHighAccuracy: true
				});

				const { latitude, longitude } = coords;

				setCurrentRegion({
					latitude,
					longitude,
					latitudeDelta: 0.02,
					longitudeDelta: 0.02
				});
			}
		}
		loadInitialPosition();
	}, []);

	function setupWebsocket() {
		const { latitude, longitude } = currentRegion;
		connect(latitude, longitude, techs);
	}

	async function loadDevs() {
		const { latitude, longitude } = currentRegion;

		const response = await api.get("/search", {
			params: {
				latitude,
				longitude,
				techs
			}
		});
		console.log(response.data.devs);

		setDevs(response.data.devs);
		setupWebsocket();
	}

	function handleRegionChanged(region) {
		console.log(region);
		setCurrentRegion(region);
	}

	if (!currentRegion) {
		return null;
	}

	return (
		<>
			<MapView
				onRegionChange={handleRegionChanged}
				initialRegion={currentRegion}
				style={styles.map}
			>
				{devs.map(dev => {
					return (
						<Marker
							key={dev._id}
							coordinate={{
								longitude: dev.location.coordinates[0],
								latitude: dev.location.coordinates[1]
							}}
						>
							<View style={styles.shadow}>
								<Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
							</View>
							<Callout
								onPress={() => {
									navigation.navigate("Profile", {
										github_username: dev.github_username
									});
								}}
							>
								<View style={styles.callout}>
									<Text style={styles.devName}>{dev.name}</Text>
									<Text style={styles.devBio}>{dev.bio}</Text>
									<Text style={styles.devTechs}>{dev.techs.join(", ")}</Text>
								</View>
							</Callout>
						</Marker>
					);
				})}
			</MapView>

			<SafeAreaView style={styles.searchForm}>
				<TextInput
					style={styles.searchInput}
					placeholder="Buscar devs por techs..."
					placeholderTextColor="#999"
					autoCapitalize="words"
					onChangeText={setTechs}
					autoCorrect={false}
				/>
				<TouchableOpacity
					onPress={() => {
						loadDevs();
					}}
					style={styles.loadButton}
				>
					<MaterialIcons name="my-location" size={20} color="#fff" />
				</TouchableOpacity>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	map: {
		flex: 1
	},
	avatar: {
		width: 56,
		height: 56,
		borderRadius: 4,
		borderWidth: 4,
		borderColor: "#fff"
	},
	shadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5
		},
		shadowOpacity: 0.34,
		shadowRadius: 6.27,

		elevation: 10
	},
	callout: {
		width: 256,
		padding: 8
	},
	devName: {
		fontWeight: "600",
		fontSize: 24,
		color: "#121212",
		marginBottom: 5
	},
	devBio: {
		fontSize: 16,
		color: "#666"
	},
	devTechs: {
		fontSize: 12,
		fontWeight: "600",
		marginTop: 8,
		marginLeft: "auto",
		color: "teal"
	},
	searchForm: {
		position: "absolute",
		top: 24,
		left: 24,
		right: 24,
		zIndex: 5,
		flexDirection: "row"
	},
	searchInput: {
		flex: 1,
		height: 48,
		backgroundColor: "#fff",
		color: "#121212",
		borderRadius: 24,
		paddingHorizontal: 24,
		fontSize: 16,
		shadowColor: "#000",
		shadowOpacity: 0.2,
		shadowOffset: {
			width: 4,
			height: 4
		},
		elevation: 2
	},
	loadButton: {
		width: 48,
		height: 48,
		backgroundColor: "teal",
		borderRadius: 24,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 16
	}
});

export default Main;
