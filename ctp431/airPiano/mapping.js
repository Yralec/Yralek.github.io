function fingerNoteMapping(oldF, oldN, newF){	//n 0-4
	if(newF == 0){
		if(oldF == 0){
			switch(oldN){
				case 0:
				case 1:
				case 2:
					return 0
					break
				default:
					return -1
					err.log("mappingERR: Invalid configuratoin, oldF " + oldF + ", oldN " + oldN)
					break
			}
		} else if(oldF == 1){
			switch(oldN){
				case 1:
					return 0
					break
				case 2:
					return 1
					break
				case 3:
					return 2
					break
				default:
					return -1
					err.log("mappingERR: Invalid configuratoin, oldF " + oldF + ", oldN " + oldN)
					break
			}
		} else if(oldF == 2){
			switch(oldN){
				case 2:
					return 0
					break
				case 3:
					return 1
					break
				case 4:
					return 2
					break
				default:
					return -1
					err.log("mappingERR: Invalid configuratoin, oldF " + oldF + ", oldN " + oldN)
					break
			}
		}
	} else if(newF == 1){
		if(oldF == 0){
			switch(oldN){
				case 0:
					return 1
					break
				case 1:
				case 2:
					return 2
					break
				default:
					return -1
					err.log("mappingERR: Invalid configuratoin, oldF " + oldF + ", oldN " + oldN)
					break
			}
		} else if(oldF == 1){
			switch(oldN){
				case 1:
				case 2:
				case 3:
					return 2
					break
				default:
					return -1
					err.log("mappingERR: Invalid configuratoin, oldF " + oldF + ", oldN " + oldN)
					break
			}
		} else if(oldF == 2){
			switch(oldN){
				case 2:
				case 3:
					return 2
					break
				case 4:
					return 3
					break
				default:
					return -1
					err.log("mappingERR: Invalid configuratoin, oldF " + oldF + ", oldN " + oldN)
					break
			}
		}
	} else if(newF == 2){
		if(oldF == 0){
			switch(oldN){
				case 0:
					return 2
					break
				case 1:
					return 3
					break
				case 2:
					return 4
					break
				default:
					return -1
					err.log("mappingERR: Invalid configuratoin, oldF " + oldF + ", oldN " + oldN)
					break
			}
		} else if(oldF == 1){
			switch(oldN){
				case 1:
					return 2
					break
				case 2:
					return 3
					break
				case 3:
					return 4
					break
				default:
					return -1
					err.log("mappingERR: Invalid configuratoin, oldF " + oldF + ", oldN " + oldN)
					break
			}
		} else if(oldF == 2){
			switch(oldN){
				case 2:
				case 3:
				case 4:
					return 4
					break
				default:
					return -1
					err.log("mappingERR: Invalid configuratoin, oldF " + oldF + ", oldN " + oldN)
					break
			}
		}
	}
}