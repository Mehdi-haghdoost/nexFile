
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, cleanup, waitFor } from '@testing-library/react';
import useSignatures from './useSignatures';
import { api } from '@/lib/fetchWithAuth';
import useSignaturesStore from '@/store/features/signatures/signaturesStore';
import { showErrorToast } from '@/lib/toast';

vi.mock('@/lib/fetchWithAuth', () => ({
    api: {
        get: vi.fn(),
    },
}));

vi.mock('@/lib/toast', () => ({
    showErrorToast: vi.fn(),
}));

const TestConsumer = ({ label }) => {
    const { signatures, isLoading } = useSignatures();

    return (
        <div>
            <span>{label}</span>
            <span>{isLoading ? 'Loading' : 'Loaded'}</span>
            <span>{signatures.length}</span>
        </div>
    );
};

describe('useSignatures', () => {
    beforeEach(() => {
        useSignaturesStore.setState({
            signatures: [],
            isLoading: false,
            error: null,
        });

        api.get.mockReset();
        showErrorToast.mockReset();
    });

    afterEach(() => {
        cleanup();
    });

    it('shares one request between simultaneous consumers', async () => {
        let resolveRequest;

        api.get.mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolveRequest = resolve;
                }),
        );

        render(
            <>
                <TestConsumer label="Consumer A" />
                <TestConsumer label="Consumer B" />
            </>,
        );

        expect(api.get).toHaveBeenCalledTimes(1);
        expect(api.get).toHaveBeenCalledWith('/api/signatures');

        await act(async () => {
            resolveRequest({
                ok: true,
                json: async () => ({
                    signatures: [
                        {
                            _id: 'signature-1',
                            name: 'Test signature',
                            type: 'draw',
                        },
                    ],
                }),
            });
        });

        expect(screen.getAllByText('1')).toHaveLength(2);
        expect(screen.getAllByText('Loaded')).toHaveLength(2);
        expect(api.get).toHaveBeenCalledTimes(1);
    });

    it('does not show an error toast when the session expires', async () => {
        api.get.mockRejectedValue(new Error('Session expired'));

        render(<TestConsumer label="Consumer A" />);

        await waitFor(() => {
            expect(useSignaturesStore.getState().error).toBe(
                'Session expired',
            );
            expect(useSignaturesStore.getState().isLoading).toBe(false);
        });

        expect(showErrorToast).not.toHaveBeenCalled();
    });
});
