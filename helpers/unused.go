package helpers

// UNUSED allows unused variables to be included in Go programs
// this is necessary because global variables can be assigned to but not used
func Unused(x ...interface{}) {
	for _, v := range x {
		_ = v
	}
}
