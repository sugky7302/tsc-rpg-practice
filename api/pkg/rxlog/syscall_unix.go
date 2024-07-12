package rxlog

// import (
// 	"os"
// 	"syscall"
// )

// // Mac/Linux 專用處理 panic 的函數
// // Arm 架構的 Linux 不支援 syscall.Dup2，所以改用 syscall.Dup3
// func RedirectStderrForUnix(f *os.File) error {
// 	return syscall.Dup3(int(f.Fd()), int(os.Stderr.Fd()), 0)
// }
