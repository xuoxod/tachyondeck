import React, { useState, useRef } from 'react';
import { View, TextInput, Text, FlatList, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TerminalProps {
  output: string[];
  onCommandSubmit: (command: string) => void;
}

export const Terminal: React.FC<TerminalProps> = ({ output, onCommandSubmit }) => {
  const [inputVal, setInputVal] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();

  const handleSubmit = () => {
    const trimmed = inputVal.trim();
    if (trimmed.length > 0) {
      onCommandSubmit(trimmed);
      setInputVal(''); // Clear input after submit
    }
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Text key={index} style={styles.consoleText}>
      {item}
    </Text>
  );

  return (
    <SafeAreaView style={styles.safeArea} testID="terminal-container">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={output}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          style={styles.outputContainer}
          contentContainerStyle={styles.outputContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          initialNumToRender={50} // Perf: Virtualization protects edge cases of large command outputs
          maxToRenderPerBatch={50}
          windowSize={10}
        />

        <View style={[styles.inputContainer, { paddingBottom: insets.bottom + 10 }]}>
          <Text style={styles.promptText}>$ </Text>
          <TextInput
            testID="terminal-input"
            style={styles.input}
            value={inputVal}
            onChangeText={setInputVal}
            onSubmitEditing={handleSubmit}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            keyboardType="ascii-capable" // Focuses mobile keyboards toward symbols needed for bashing
            returnKeyType="send"
            placeholder="enter command..."
            placeholderTextColor="#555"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000', // Pure black like a real terminal
  },
  container: {
    flex: 1,
  },
  outputContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  outputContent: {
    paddingVertical: 10,
  },
  consoleText: {
    color: '#00FF00', // Hacker green
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
    marginBottom: 2, // Slight gap for readability
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#111',
  },
  promptText: {
    color: '#00FF00',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 16,
    marginRight: 5,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 16,
    height: 40,
  }
});
