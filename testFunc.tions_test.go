package main

import (
	"fmt"
	"testing"
)

func TestGetSoftwareFiles(t *testing.T) {

	item , err := getFileAndFolders("e1239eb8ff1bb1c4fc3d6d3e76210dafda1610b834a212fb782edb5a13952f10") 
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(item)

}