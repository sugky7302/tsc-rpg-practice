package str2time

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestStr2Time(t *testing.T) {
	c := assert.New(t)
	c.Equal(time.Hour*24*365*15, Str2Time("15y"))
	c.Equal(time.Hour*24*30*137, Str2Time("137M"))
	c.Equal(time.Hour*24*118, Str2Time("118d"))
	c.Equal(time.Hour*36, Str2Time("36h"))
	c.Equal(time.Minute*1548, Str2Time("1548m"))
	c.Equal(time.Second*1895, Str2Time("1895s"))
	c.Equal((8*365+9*30+5)*24*time.Hour, Str2Time("8y9M5d"))
	c.Equal(2500000*time.Hour, Str2Time("inf"))
}

func TestTime2Str(t *testing.T) {
	c := assert.New(t)
	c.Equal("87y", Time2Str(87*365*24*time.Hour))
	c.Equal("36M", Time2Str(36*30*24*time.Hour, "M"))
	c.Equal("123d", Time2Str(123*24*time.Hour, "d"))
	c.Equal("887h", Time2Str(887*time.Hour, "h"))
	c.Equal("987m", Time2Str(987*time.Minute, "m"))
	c.Equal("1234s", Time2Str(1234*time.Second, "s"))
	c.Equal("100ms", Time2Str(100*time.Millisecond, "ms"))
	c.Equal("87us", Time2Str(87*time.Microsecond, "us"))
	c.Equal("134ns", Time2Str(134*time.Nanosecond, "ns"))
	c.Equal("8y9M5d", Time2Str((8*365+9*30+5)*24*time.Hour))
	c.Equal("inf", Time2Str(2500000*time.Hour))
}
