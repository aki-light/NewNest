export default interface MessageWindowDelegate {
    onMessageWindowClosed(): void;
    onOptionSelected(optionType: number): void;
}