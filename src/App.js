import { useState, useEffect } from "react";
import {
    Alert,
    FlatList,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import s from "../style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar, Keyboard } from "react-native";

const App = () => {
    const [memos, setMemos] = useState([]);  // 일기 목록과 업데이트 함수 관리
    const [writeMode, setWriteMode] = useState(false);  // 일기 작성 모드의 상태 관리
    const [txt, setTxt] = useState("");  // 입력된 텍스트와 업데이트 함수 관리
    const [editMode, setEditMode] = useState(false);  // 일기 수정 모드의 상태 관리
    const [editedMemoId, setEditedMemoId] = useState(null);  // 수정 중인 메모리 id 관리
    const [searchQuery, setSerchQuery] = useState("");  // 검색 쿼리 관리
    const [selectedEmotion, setSelectedEmotion] = useState("");  // 선택된 감정 관리 

    // 일기 저장
    const saveMemos = async (memosToSave) => {
        try {
            await AsyncStorage.setItem("@memos", JSON.stringify(memosToSave));  
        }
        catch (e) {
            Alert.alert(
                "에러",
                "데이터를 불러오는 중 문제가 발생했습니다."
            );
        }
    };

    // AsyncStorage에서 '@memos' 키로 저장된 데이터를 가지고 옴
    const loadMemos = async () => {
        try {
            const storedMemos = await AsyncStorage.getItem("@memos");
            if (storedMemos !== null) {
                let parsedMemos = JSON.parse(storedMemos).reverse();  
                setMemos(parsedMemos);  
            }
        }
        catch (e) {
            Alert.alert(
                "에러",
                "데이터를 불러오는 중 문제가 발생했습니다."
            );
        }
    };

    // 감정 선택 함수 
    const selectEmotion = (emotion) => { 
        setSelectedEmotion(emotion);
        setSerchQuery(""); 
    };

    useEffect(() => {
        loadMemos();  
    }, []);

    useEffect(() => {
        saveMemos(memos); 
    }, [memos]);

    const renderMemo = ({ item }) => {
        // item의 id를 날짜 형식으로 변환
        const memoDate = new Date(item.id);
        const formattedDate = `${memoDate.getFullYear()}-${
        memoDate.getMonth() + 1 < 10 ? '0' : ''
        }${memoDate.getMonth() + 1}-${memoDate.getDate() < 10 ? '0' : ''}${memoDate.getDate()}`;
        
        // 검색어에 따라 일기를 필터링하고, 선택된 감정과도 일치하는지 확인
        if (
        (item.memo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            formattedDate.includes(searchQuery)) &&
            (selectedEmotion === '' || item.emotion === selectedEmotion)
        ) {
            // 조건이 충족되면 해당 일기를 화면에 렌더링
            return (
                <View style={s.renderView}>
                    <View style={s.memoContent}>
                        {/* 일기의 id */}
                        <Text style={s.renderText}>{item.id}</Text> 
                        {/* 일기 내용 */}
                        <Text>{item.memo}</Text>
                        {/* 일기의 감정 */}
                        <Text>Emotion: {item.emotion}</Text>
                    </View>

                    <View style={s.buttons}>
                        {/* 수정 버튼 */}
                        <TouchableOpacity
                            style={[s.button, s.editButton]}
                            onPress={() => editMemo(item.id)}
                        >
                            <Text style={s.btnText}>수정</Text>
                        </TouchableOpacity>

                        {/* 삭제 버튼 */}
                        <TouchableOpacity
                            style={[s.button, s.deleteButton]}
                            onPress={() => deleteMemo(item.id)}
                        >
                            <Text style={s.btnText}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        return null;  // 조건이 충족되지 않으면 아무것도 리턴 X 
    };

    // 일기 추가 
    const addMemo = () => {
        // 텍스트가 비어 있지 않은 경우에만 일기 추가
        if (txt.trim() !== "") {
            const currentDate = new Date();
            const timestamp = currentDate.toISOString(); 
            const newMemo = { id: timestamp, memo: txt, emotion: selectedEmotion }; 
            
            setMemos((prevMemos) => [newMemo, ...prevMemos]); 
            setWriteMode(false);  
            setTxt("");  
            setSelectedEmotion("");  
        }
    };

    // 일기 삭제 
    const deleteMemo = (id) => {
        Alert.alert(
            "삭제 확인",
            "정말로 삭제하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel",
                },
                {
                    text: "확인",
                    onPress: () => {
                        // 선택된 일기를 제외하고 이전 메모 목록은 유지
                        setMemos((prevMemos) => prevMemos.filter((memo) => memo.id !== id));
                        setSerchQuery("");  
                    },
                    style: "destructive",
                },
            ],
            { cancelable: false }
        );
    };

    // 일기 수정
    const editMemo = (id) => {
        // 수정할 일기를 찾아 해당 텍스트를 가져와 상태 업데이트
        setTxt(memos.find((memo) => memo.id === id)?.memo || "");
        setEditMode(true);  
        setEditedMemoId(id); 
        setSerchQuery("");  
    };

    // 일기 업데이트
    const updateMemo = () => {
        if (txt.trim() !== "") {
            const updatedMemos = memos.map((memo) =>
                memo.id === editedMemoId ? { ...memo, memo: txt, emotion: selectedEmotion } : memo
            );
            const editedIndex = updatedMemos.findIndex((memo) => memo.id === editedMemoId);
            const editedMemo = updatedMemos[editedIndex];
            updatedMemos.splice(editedIndex, 1);
            updatedMemos.unshift(editedMemo); 

            setMemos(updatedMemos); 
            setSerchQuery("");  
            setTxt(""); 
            setSelectedEmotion(""); 
            setEditMode(false); 
        }
    };

    const searchMemo = () => {
        Keyboard.dismiss();
    }

    if (editMode) {
        // 일기 수정 모드 화면 
        return (
            <SafeAreaView style={s.container2}>
                <View style={s.flex1}>
                    {/* 수정 취소 및 수정 완료 버튼 */}
                    <View style={s.wmb}>
                        <TouchableOpacity style={s.padding16} onPress={() => setEditMode(false)}>
                            <Text style={s.btn1}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={s.padding16} onPress={updateMemo}>
                            <Text style={s.btn1}>수정 완료</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 수정할 내용을 입력하는 입력창 */}
                    <View style={s.contentWr}>
                        <TextInput
                            style={s.textInput}
                            multiline
                            onChangeText={(text) => setTxt(text)}
                            value={txt}
                            placeholder="오늘 하루를 기록해보세요."
                        />
                    </View>

                    {/* 현재 감정을 선택하는 버튼 */}
                    <View style={s.emotionContainer}>
                        <TouchableOpacity
                            style={[s.emotionButton, selectedEmotion === "happy" ? s.selectedEmotion : null]}
                            onPress={() => selectEmotion("happy")}
                        >
                            <Text style={s.emotionButtonText}>😊</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[s.emotionButton, selectedEmotion === "sad" ? s.selectedEmotion : null]}
                            onPress={() => selectEmotion("sad")}
                        >
                            <Text style={s.emotionButtonText}>😢</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[s.emotionButton, selectedEmotion === "angry" ? s.selectedEmotion : null]}
                            onPress={() => selectEmotion("angry")}
                        >
                            <Text style={s.emotionButtonText}>😠</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[s.emotionButton, selectedEmotion === "depressed" ? s.selectedEmotion : null]}
                            onPress={() => selectEmotion("depressed")}
                        >
                            <Text style={s.emotionButtonText}>😞</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[s.emotionButton, selectedEmotion === "neutral" ? s.selectedEmotion : null]}
                            onPress={() => selectEmotion("neutral")}
                        >
                            <Text style={s.emotionButtonText}>😐</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    } else if (writeMode) {
        // 일기 작성 모드 화면
        return (
            <SafeAreaView style={s.container2}>
                <View style={s.flex1}>
                    {/* 작성 취소 및 저장 버튼 */}
                    <View style={s.wmb}>
                        <TouchableOpacity style={s.padding16} onPress={() => setWriteMode(false)}>
                            <Text style={s.btn1}>취소</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={s.padding16} onPress={addMemo}>
                            <Text style={s.btn1}>저장</Text>
                        </TouchableOpacity>
                    </View>

                    {/* 일기 내용 입력창 */}
                    <View style={s.contentWr}>
                        <TextInput
                            style={s.textInput}
                            multiline
                            onChangeText={(text) => setTxt(text)}
                            value={txt}
                            placeholder="오늘 하루를 기록해보세요."
                        />
                    </View>

                    {/* 현재 감정 선택 버튼 추가 */}
                    <View style={s.emotionContainer}>
                        <TouchableOpacity
                            style={[s.emotionButton, selectedEmotion === "happy" ? s.selectedEmotion : null]}
                            onPress={() => selectEmotion("happy")}
                        >
                            <Text style={s.emotionButtonText}>😊</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[s.emotionButton, selectedEmotion === "sad" ? s.selectedEmotion : null]}
                            onPress={() => selectEmotion("sad")}
                        >
                            <Text style={s.emotionButtonText}>😢</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[s.emotionButton, selectedEmotion === "angry" ? s.selectedEmotion : null]}
                            onPress={() => selectEmotion("angry")}
                        >
                            <Text style={s.emotionButtonText}>😠</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[s.emotionButton, selectedEmotion === "depressed" ? s.selectedEmotion : null]}
                            onPress={() => selectEmotion("depressed")}
                        >
                            <Text style={s.emotionButtonText}>😞</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[s.emotionButton, selectedEmotion === "neutral" ? s.selectedEmotion : null]}
                            onPress={() => selectEmotion("neutral")}
                        >
                            <Text style={s.emotionButtonText}>😐</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={s.container}>
                {/* 메인 화면 */}
                <View>
                    <Text style={s.titleTxt}>일기장</Text>
                    {/* 검색 기능 */}
                    <View style={s.searchContainer}>
                        <TextInput
                            style={s.searchInput}
                            placeholder="찾고 싶은 단어나 해당 날짜를 검색해보세요."
                            onChangeText={(text) => setSerchQuery(text)}
                            value={searchQuery}
                            onSubmitEditing={searchMemo}
                        />
                    </View>
                        
                    {/* 당시 회상하고 싶은 감정 선택 */}
                    <View style={s.infoContainer}>
                        <Text style={s.infoText}>
                            당시 회상하고 싶은 감정을 선택해보세요.{"\n"}
                            그 기분을 느꼈던 날의 일기를 보여드립니다.
                        </Text>
                    </View>

                    {/* 감정 선택 버튼 */}
                    <View style={s.emotionContainer}>
                        <View style={s.emotionContainer}>
                            <TouchableOpacity
                                style={[s.emotionButton, selectedEmotion === "happy" ? s.selectedEmotion : null]}
                                onPress={() => selectEmotion("happy")}
                            >
                                <Text style={s.emotionButtonText}>😊</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[s.emotionButton, selectedEmotion === "sad" ? s.selectedEmotion : null]}
                                onPress={() => selectEmotion("sad")}
                            >
                                <Text style={s.emotionButtonText}>😢</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[s.emotionButton, selectedEmotion === "angry" ? s.selectedEmotion : null]}
                                onPress={() => selectEmotion("angry")}
                            >
                                <Text style={s.emotionButtonText}>😠</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[s.emotionButton, selectedEmotion === "depressed" ? s.selectedEmotion : null]}
                                onPress={() => selectEmotion("depressed")}
                            >
                                <Text style={s.emotionButtonText}>😞</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[s.emotionButton, selectedEmotion === "neutral" ? s.selectedEmotion : null]}
                                onPress={() => selectEmotion("neutral")}
                            >
                                <Text style={s.emotionButtonText}>😐</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 일기 목록 */}
                <View style={s.contentWr}>
                    <View style={s.flex1}>
                        <FlatList data={memos} renderItem={renderMemo} />
                    </View>

                    {/* 글쓰기 버튼 */}
                    <View style={s.pos}>
                        <View style={s.sun}>
                            <TouchableOpacity onPress={() => setWriteMode(true)}>
                                <Text style={s.txtWhite}>글쓰기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                
                <StatusBar style="auto" />
            </SafeAreaView>
        );
    };
};

export default App;