package rxlog

import (
	"os"
)

// Windows 專用處理 panic 的函數
func RedirectStderrForWin(f *os.File) error {
	// SetStdHandle does not affect prior references to stderr
	os.Stderr = f
	return nil
}
