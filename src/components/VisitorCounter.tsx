interface VisitorCounterProps {
    count: number;
}

const VisitorCounter = ({ count }: VisitorCounterProps) => {
    const counterStyle = {
        color: 'orange',
        fontFamily: '"Digital-7 Mono", monospace',
        fontSize: '24px',
    };

    return (
        <p>訪問者数: <span style={counterStyle}>{count}</span></p>
    );
};

export default VisitorCounter;
